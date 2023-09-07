// src/module/user/user.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { UserDTO } from './user.dto';
import { Request, Response } from 'express';

@Controller('/api/v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/get-all')
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get('/get-by-id/:id')
  async findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(id);
  }
  // register
  @Post('/register')
  async register(@Body() user: UserDTO, @Res() res: Response) {
    await this.userService.registerUser(user, res);
  }
  // login user
  @Post('/login')
  async login(
    @Body() credentials: { email: string; password: string },
    @Res() res: Response,
  ) {
    await this.userService.loginUser(credentials, res);
  }
  // login admin
  @Post('/login-admin')
  async loginAdmin(
    @Body() credentials: { email: string; password: string },
    @Res() res: Response,
  ) {
    return await this.userService.loginAdmin(credentials, res);
  }
  // block user
  @Patch('/blocked-user/:id')
  async blockUser(
    @Param('id') id: string,
    @Body() body: any,
    @Res() res: Response,
  ) {
    try {
      await this.userService.blockUser(id, body);
      res.status(200).json({ message: 'Blocked User Successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
  // search
  @Post('/search')
  async searchUser(
    @Body() searchCriteria: { lastname: string },
    @Res() res: Response,
  ) {
    try {
      const user = await this.userService.searchUser(searchCriteria.lastname);
      if (user.length === 0) {
        res.status(404).json({ message: 'User not found' });
      } else {
        res.status(200).json(user);
      }
    } catch (error) {
      console.error({ error: 'User does not exist' });
      res.status(500).json({ message: 'Internal server error' });
    }
  }
  // Logout
  @Post('/logout')
  async logoutUser(@Req() req: Request, @Res() res: Response) {
    await this.userService.logoutUser(req, res);
  }
  // Refresh token
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
  @Post('/forgot-password-token')
  async sendForgotPasswordEmail(@Body() body: { email: string }) {
    return this.userService.sendForgotPasswordEmail(body.email);
  }
  @Put('/reset-password/:token')
  async resetPassword(
    @Body('password') password: string,
    @Param('token') token: string,
  ) {
    return this.userService.resetPassword(password, token);
  }
  @Post('refresh-token')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    await this.userService.refreshToken(req, res);
  }
}
