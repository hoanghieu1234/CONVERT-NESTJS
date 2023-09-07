import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ collection: 'comments' }) // Tên collection trong MongoDB
export class Comment extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  idUser: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  idProduct: Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true, min: 0, max: 5, validate: (value: number) => {
    if (value >= 0.5 && value <= 5) {
      return true;
    } else if (Number.isInteger(value) && value >= 1 && value <= 5) {
      return true;
    }
    return false;
  } })
  rating: number;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
