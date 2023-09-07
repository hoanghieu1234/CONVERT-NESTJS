import { Body, Controller, Delete, Get, Param, Post, Res } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './payment.dto';

@Controller('/api/v1/payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}
  @Post()
  async createPayment(
    @Body() createPaymentDto: CreatePaymentDto,
    @Res() res: Response,
  ) {
    const savedPayment = await this.paymentService.createPayment(createPaymentDto,res);
    return savedPayment
  }
  @Get('get-all')
  async getAllPayments(@Res() res: Response) {
    return this.paymentService.getAllPayments(res)
  }
  @Delete('delete/:id')
  async deletePayment(@Param() param,@Res() res: Response) {
    return this.paymentService.deletePayment(param,res)
  }
}
