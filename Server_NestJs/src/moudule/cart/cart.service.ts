import { Response } from 'express';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from './cart.entity';
import { Model, Types } from 'mongoose';
import { CartDto } from './cart.dto';

@Injectable()
export class CartService {
  constructor(@InjectModel(Cart.name) private cartModel: Model<Cart>) {}

  async addToCart(body: any, res: Response) {
    const userId = body.idUser;
    const productId = body.idProduct;

    const idUserConvertObjectId = new Types.ObjectId(userId);
    const idProductConvertObjectId = new Types.ObjectId(productId);

    try {
      const cartItems = await this.cartModel
        .findOne({
          idUser: idUserConvertObjectId,
          idProduct: idProductConvertObjectId,
        })
        .populate('idProduct')
        .exec();
      if (cartItems) {
        cartItems.quantity += 1;
        await cartItems.save();
        res.status(200).json({ message: 'Sản phẩm được cộng lên một' });
      } else {
        // Nếu chưa tồn tại, thêm nó vào giỏ hàng
        const newCartItem = new this.cartModel({
          idUser: idUserConvertObjectId,
          idProduct: idProductConvertObjectId,
          quantity: 1,
        });
        await newCartItem.save();
        // Trả về phản hồi thành công cho client
        return res
          .status(200)
          .json({ message: 'Thêm sản phẩm vào giỏ hàng thành công' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Đã xảy ra lỗi' });
    }
  }
  async getCartItems(idUser:string, res: Response) {
    const idUserConvertObjectId = new Types.ObjectId(idUser);
    try {
      const cartItems = await this.cartModel
        .find({ idUser: idUserConvertObjectId })
        .populate('idProduct');
      if (cartItems.length > 0) {
        return res.status(200).json(cartItems);
      } else {
        return res.status(200).json({ message: 'Giỏ hàng trống' });
      }
    } catch (error) {
      if (error) {
        return res.status(404).json({ msg: 'Không tìm thấy giỏ hàng' });
      }
      return res.status(500).json({ message: 'Đã có lỗi xảy ra' });
    }
  }
  async updateQuantity(id: any, newQuantity: number, res: Response) {
    const idConvertObjectId = new Types.ObjectId(id);

    try {
      const updateQuantity = await this.cartModel
        .findByIdAndUpdate({
          _id: idConvertObjectId,
          quantity: newQuantity,
          new: true,
        })
        .exec();

      if (!updateQuantity) {
        return res.status(404).json({ msg: 'Cart not found' });
      }

      updateQuantity.quantity = newQuantity;
      await updateQuantity.save();

      return res.status(200).json({ msg: 'Updated Successfully' });
    } catch (error) {
      if (error) {
        return res.status(404).json({ msg: 'Cart not found' });
      }
      console.error(error);
    }
  }
  async deleteCartItem(id, res: Response) {
    const idConvertObjectId = new Types.ObjectId(id);

    try {
      const deleteCartItem = await this.cartModel.findOneAndDelete({
        idProduct: idConvertObjectId,
      });

      if (deleteCartItem) {
        return res
          .status(200)
          .json({ message: 'Đã xóa sản phẩm khỏi giỏ hàng' });
      } else {
        return res
          .status(404)
          .json({ message: 'Không tìm thấy mục trong giỏ hàng' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Đã có lỗi xảy ra' });
    }
  }
}
