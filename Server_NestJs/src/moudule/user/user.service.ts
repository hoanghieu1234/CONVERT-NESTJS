import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.entity';
import { UserDTO } from './user.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import * as crypto from 'crypto';
import { sendEmail } from '../../../utils/mailer.utils';
require('dotenv').config();

@Injectable()
export class UserService {
  private refreshTokenArr: string[] = [];
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  async registerUser(user: UserDTO, res: Response): Promise<any> {
    const { firstname, lastname, email, mobile, password } = user;
    try {
      const existingUser = await this.userModel.findOne({email});
      console.log(existingUser, 567);

      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new this.userModel({
        firstname: firstname,
        lastname: lastname,
        mobile: mobile,
        email: email,
        password: hashedPassword,
      });

      await newUser.save();

      return res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  // login user
  async loginUser(
    credentials: { email: string; password: string },
    res: Response,
  ) {
    try {
      const user = await this.userModel
        .findOne({ email: credentials.email })
        .exec();
      console.log(user, 999);
      if (user) {
        const isPasswordMatched = await bcrypt.compare(
          credentials.password,
          user.password,
        );
        if (isPasswordMatched) {
          const accessToken = jwt.sign(
            { email: user.email },
            process.env.SECRET_KEY,
            {
              expiresIn: '60s',
            },
          );
          const refreshToken = jwt.sign(
            { email: user.email },
            process.env.SECRET_REFRESH_TOKEN,
            {
              expiresIn: '365d',
            },
          );
          this.refreshTokenArr.push(refreshToken);
          const { password, ...data } = user.toObject(); // bo password
          res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
          });
          return res.status(200).json({
            message: 'Login successfully',
            accessToken: accessToken,
            data: data,
          });
        } else {
          return res.status(401).json({ message: 'Incorrect password' });
        }
      }
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: 'An error occurred during login' });
    }
  }

  // login administrator
  async loginAdmin(credentials: any, res: Response): Promise<any> {
    const { email, password } = credentials;
    try {
      const findAdmin = await this.userModel
        .findOne({ email: credentials.email })
        .exec();
      if (findAdmin && findAdmin.role === 'admin') {
        const isPasswordMatched = await bcrypt.compare(
          password,
          findAdmin.password,
        );
        if (isPasswordMatched) {
          const accessToken = jwt.sign(
            { email: findAdmin.email },
            process.env.SECRET_KEY,
            {
              expiresIn: '60s',
            },
          ); // Token hết hạn trong vòng 30s , vd thêm : 30d ,30m

          const refreshToken = jwt.sign(
            { email: findAdmin.email },
            process.env.SECRET_REFRESH_TOKEN,
            { expiresIn: '365d' },
          ); // Tạo refreshToken để dự trữ
          this.refreshTokenArr.push(refreshToken); // push refresh token vào 1 mảng để lưu trữ
          const { password: _, ...data } = findAdmin.toObject(); //loại bỏ password ra khỏi phần data trả về frontend,destructuring
          res.cookie('refreshToken', refreshToken, {
            //Lưu refreshToken vào cookie khi đăng nhập thành công
            httpOnly: true,
            secure: true,
            sameSite: 'none',
          });
          res.status(200).json({
            data,
            accessToken,
          });
        } else {
          res
            .status(401)
            .json({ message: 'Thông tin tài khoản mật khẩu không chính xác!' });
        }
      } else {
        res.status(401).json({ message: 'Không có quyền truy cập' });
      }
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }
  // block user 
  async blockUser(id: string, body:any) {
    const { isBlocked } = body;

    try {
      const userToUpdate = await this.userModel.findById(id).exec();
      if (!userToUpdate) {
        throw new NotFoundException('Not Found User !');
      } else if (userToUpdate.role === 'admin') {
        throw new ForbiddenException('Role Admin Is Not Blocked !');
      }

      userToUpdate.isBlocked = isBlocked;
      return userToUpdate.save();
    } catch (error) {
      throw new UnauthorizedException('Invalid Unauthorized');
    }
  }
  // search
  async searchUser(lastname: string): Promise<User[]> {
    try {
      const users = await this.userModel.find({
        lastname: { $regex: lastname, $options: 'i' },
      });
      return users;
    } catch (error) {
      throw error;
    }
  }
  async deleteUser(id: string): Promise<{ message: string; status: number }> {
    // Tìm người dùng theo id
    const userToDelete = await this.userModel.findById(id).exec();
    if (!userToDelete) {
      throw new NotFoundException('User not found');
    }
    await userToDelete.deleteOne();
    return { message: 'delete successfully', status: 204 };
  }
  // Logout user
  async logoutUser(req: Request, res: Response): Promise<void> {
    console.log('da vao')
    res.clearCookie('refreshToken');
    this.refreshTokenArr = this.refreshTokenArr.filter(
      (token) => token !== req.cookies.refreshToken,
    );
    console.log(this.refreshToken, 'refresh token')
    res.status(200).json({ msg: 'Logout successful' });
  }

  // send mails
  async sendForgotPasswordEmail(email: string): Promise<any> {
    if (!email) {
      throw new NotFoundException('Missing email');
    }
    try {
      const findUser: User | null = await this.userModel
        .findOne({ email })
        .exec();
      if (!findUser) {
        throw new NotFoundException('User not found with this email');
      }

      const expirationTime = new Date();
      expirationTime.setMinutes(expirationTime.getMinutes() + 10);

      const token = await this.createPasswordResetToken(findUser);

      findUser.passwordResetExpires = expirationTime;
      await findUser.save();

      const resetURL = `Xin chào, Vui lòng nhấp vào liên kết này để đặt lại Mật khẩu của bạn. Liên kết này có hiệu lực đến 10 phút kể từ bây giờ. <a href='http://localhost:3000/forgot-password/${token}'>Click Here</a>`;
      const emailData = {
        to: email,
        text: 'Hey User',
        subject: 'Forgot Password Link',
        html: resetURL,
      };

      await sendEmail(emailData);

      return {
        token,
        message: 'Password reset email sent successfully',
      };
    } catch (error) {
      throw error;
    }
  }
  // Mã bạn đã cung cấp là một chuỗi hex (hệ cơ số 16) được tạo ra bởi hàm crypto.randomBytes trong Node.js. Đây là một giá trị ngẫu nhiên được tạo ra để dùng làm token đặt lại mật khẩu.
  async createPasswordResetToken(user: User): Promise<string> {
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await user.save();

    return resetToken;
  }
  // Thay đổi password từ email
  async resetPassword(
    newPassword: string,
    token: string,
  ): Promise<{ success: boolean; msg: string }> {
    try {
      const hashedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');
      console.log(hashedToken, 'hashedToken');
      const user: User | null = await this.userModel.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
      });
      console.log(user, 'test');

      if (!user) {
        throw new Error('Token Expired, Please try again later');
      }

      // Mã hoá mật khẩu mới
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      user.password = hashedNewPassword;
      user.passwordResetToken = undefined;
      user.passwordChangedAt = new Date();
      user.passwordResetExpires = undefined;

      await user.save();

      return {
        success: true,
        msg: 'Updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        msg: error.message || 'Something went wrong',
      };
    }
  }
  // REFRESH TOKEN
  async refreshToken(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) res.status(401).json('Unauthenticated');

    if (!this.refreshTokenArr.includes(refreshToken)) {
      return res.status(401).json('Unauthenticated');
    }

    jwt.verify(
      refreshToken,
      process.env.SECRET_REFRESH_TOKEN,
      (err: any, user: any) => {
        if (err) {
          return res.status(400).json('refreshToken is not valid');
        }
        const { iat, exp, ...userOther } = user as { [key: string]: any }; // Type assertion for userOther

        this.refreshTokenArr = this.refreshTokenArr.filter(
          (token: any) => token !== refreshToken,
        );
        // Lọc ra những thằng cũ
        // Nếu đúng thì nó sẽ tạo accessToken mới và cả refreshToken mới
        const newAccessToken = jwt.sign(userOther, process.env.SECRET_KEY, {
          expiresIn: '1d',
        });

        const newRefreshToken: any = jwt.sign(
          userOther,
          process.env.SECRET_REFRESH_TOKEN,
          { expiresIn: '365d' },
        );

        this.refreshTokenArr.push(newRefreshToken);
        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          sameSite: 'none', // hoặc sameSite: "strict"
        });

        return res.status(200).json({ accessToken: newAccessToken });
      },
    );
    return;
  }
}
