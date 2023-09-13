import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ collection: 'payments', timestamps: true }) // Tên collection trong MongoDB
export class Payment extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  idUser: Types.ObjectId;

  @Prop({ type: [{ type: Object, ref: 'Product' }], required: true })
  listProduct: [];

  @Prop({ type: Number, required: true })
  total: number;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
