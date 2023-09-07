import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true, collection: 'carts' }) // Tên collection trong MongoDB
export class Cart extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  idUser: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Product',
    required: true,
  })
  idProduct: Types.ObjectId;

  @Prop({ type: Number, required: true, default: 1 })
  quantity: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
