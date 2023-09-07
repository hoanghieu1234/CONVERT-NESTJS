import { Types } from 'mongoose';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CartDto } from './cart.dto';

@Controller('api/v1')
export class CartController {
  constructor(private readonly cartService: CartService) {}
  @Post('add-cart')
  async addCartItems(@Body() body: CartDto, @Res() res) {
    return await this.cartService.addToCart(body, res);
  }
  @Get('get-cart/:id')
  async getCartItems(@Param() param, @Res() res) {
    return await this.cartService.getCartItems(param, res);
  }
  @Put('cart/quantity/:id')
  async updatedQuantity(@Param('id') param, @Body() body, @Res() res) {
    const newQuantity = Number(body.quantity);
    return await this.cartService.updateQuantity(param, newQuantity, res);
  }
  @Delete('delete-cart/:id')
  async deleteCart(@Param('id') param, @Res() res) {
    const deletedItem = await this.cartService.deleteCartItem(param, res);
    return deletedItem;
  }
}
