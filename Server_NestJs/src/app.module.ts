// src/app.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './moudule/user/user.module';
import { ProductModule } from './moudule/product/product.module';
import { CartModule } from './moudule/cart/cart.module';
import { PaymentModule } from './moudule/payment/payment.module';
import { CommentModule } from './moudule/comments/comment.module';

require('dotenv').config();

const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_NAME = process.env.DB_NAME;

@Module({
  imports: [
    MongooseModule.forRoot(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`),
    UserModule,
    ProductModule,
    CartModule,
    PaymentModule,
    CommentModule
  ],
})
export class AppModule {}
