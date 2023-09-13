import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Schema({ timestamps: true, collection: 'users' })
export class User extends Document {
  @Prop({ required: true })
  firstname: string;

  @Prop({ required: true })
  lastname: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  mobile: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 'user' })
  role: string;

  @Prop({ default: false })
  isBlocked: boolean;

  @Prop({
    default: [],
    type: [
      {
        productId: Types.ObjectId,
        quantity: Number,
      },
    ],
  })
  cart: { productId: Types.ObjectId; quantity: number }[];

  @Prop({ default: '' })
  address: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Product' }] })
  wishlist: Types.ObjectId[];

  @Prop()
  refreshToken: string;

  @Prop()
  passwordChangedAt: Date;

  @Prop()
  passwordResetToken: string;

  @Prop()
  passwordResetExpires: Date;

  async isPasswordMatched(enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
