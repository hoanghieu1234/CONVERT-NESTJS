import { ObjectId, Types } from 'mongoose';
import { Model } from 'mongoose';
import { Payment } from './payment.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './payment.dto';
import { Cart } from '../cart/cart.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
  ) {}

  async createPayment(createPaymentDto: CreatePaymentDto, res: any) {
    const { idUser, listProduct, total } = createPaymentDto;
    console.log("createPaymentDto",createPaymentDto.total)
    try {
      const newPayment = await new this.paymentModel({
        idUser,
        listProduct,
        total,
      }).populate("idUser");
      const savePayment = await newPayment.save();
      return res.status(200).json(savePayment);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Could not create payment' });
    }
  }
  async getAllPayments(res: any) {
    try {
      const payments = await this.paymentModel.find().populate('idUser').exec();
      console.log(payments, 1112);
      res.status(200).json(payments);
    } catch (error) {
      res.status(500).json({ error: 'Could not get payments' });
    }
  }
  async deletePayment(idUser: any, res: any): Promise<void> {
    const idUserConvert = new Types.ObjectId(idUser);
    try {
      await this.cartModel.deleteMany({ idUser: idUserConvert });
      res.status(200).json({ message: 'All cart deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
