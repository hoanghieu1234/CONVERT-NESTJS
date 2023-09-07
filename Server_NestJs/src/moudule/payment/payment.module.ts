// product.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from './payment.entity';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { Cart, CartSchema } from '../cart/cart.entity';
import { CartService } from '../cart/cart.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Payment.name, schema: PaymentSchema },
      { name: Cart.name, schema: CartSchema },
    ]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService,CartService],
})
export class PaymentModule {}
