import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Types } from 'mongoose';

export class UserDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  firstname: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  lastname: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  mobile: string;

  @IsNotEmpty()
  password: string;

  role: string;

  isBlocked: boolean;

  address: string;

  cart: { productId: Types.ObjectId; quantity: number }[];

  wishlist: Types.ObjectId[];

  refreshToken: string;

  passwordChangedAt: Date;

  passwordResetToken: string;

  passwordResetExpires: Date;
}
