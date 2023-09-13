import { multerUpload } from './../../../configs/multer.config';
import { ProductService } from './product.service';
import { Product } from './product.entity';
import { ProductDto } from './product.dto';
import { Request, Response } from 'express';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('api/v1/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Get('get-all')
  async getAllProducts(
    @Query('_sort') query: any = '',@Query('_categories') sortByCategory: any = ''
  ): Promise<Product[]> {
    console.log(query);
    console.log(sortByCategory);
    
    return this.productService.getAllProducts(query ,sortByCategory);
  }
  @Get('get-by-id/:id')
  async getProductById(@Param('id') id: string, @Res() res: Response) {
    return this.productService.getProductById(id, res as any);
  }

  @Post('create')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'image', maxCount: 1 }], multerUpload),
  )
  async createProduct(@UploadedFiles() file: any, @Body() body: ProductDto) {
    if (file.image) {
      body.image = file.image[0].path;
    }
    const createProduct = await this.productService.createProduct(body);

    return createProduct;
  }

  @Patch('/update/:id')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'image', maxCount: 1 }], multerUpload),
  )
  async updateProduct(
    @UploadedFiles() file: any,
    @Body() body: any,
    @Param('id') id: string,
  ) {
    console.log('body', body);
    if (file.image) {
      body.image = file.image[0].path;
    }
    return this.productService.updateProduct(body, id);
  }
  @Delete('/delete/:id')
  async deleteProduct(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<void> {
    await this.productService.deleteProduct(id, res);
  }
  // @Get('sorted-by-price')
  // async getSortedByPrice(@Res() res:Response,@Query("_sort") query: string = "") {
  //   return this.productService.getSortedByPrice(res,query);
  // }
}
