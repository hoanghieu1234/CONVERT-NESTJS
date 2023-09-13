
import { Types } from 'mongoose';

export class UserDTO {
  
  firstname: string;

 
  lastname: string;

  
  email: string;

  mobile: string;

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
