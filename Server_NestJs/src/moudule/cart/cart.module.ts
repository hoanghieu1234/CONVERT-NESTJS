// product.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './cart.entity';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';import { ProductModule } from '../product/product.module';
;

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    ProductModule
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
