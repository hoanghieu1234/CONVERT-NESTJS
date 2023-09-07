import { Types } from 'mongoose';
import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './product.entity';
import { ProductDto } from './product.dto';
import { Response } from 'express';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}
  async getAllProducts(): Promise<Product[]> {
    return this.productModel.find().exec();
  }
  async getProductById(id: string, res: Response): Promise<void> {
    try {
      const product = await this.productModel.findById(id).exec();
      if (!product) {
        throw new NotFoundException('Product not found');
      }
      res.status(200).json(product); // Trả về sản phẩm trong đối tượng Response bằng phương thức .json()
    } catch (error: any) {
      // Sử dụng kiểu any cho biến error
      if (error instanceof NotFoundException) {
        res.status(404).json({ message: 'Product not found' });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }
  async createProduct(ProductDto: ProductDto): Promise<Product> {
    console.log(ProductDto, 'hi');
    const data = {
      ...ProductDto,
      quantity: Number(ProductDto.quantity),
      price: Number(ProductDto.price),
    };
    const newProduct = new this.productModel(data);
    const product = await newProduct.save();
    return product;
  }
  async updateProduct(body: any, id: any) {
    const idConvert = new Types.ObjectId(id);
    try {
      const updatedProduct = await this.productModel.findByIdAndUpdate({
        _id: idConvert,
        ProductDto,
      });

      if (body.image) {
        updatedProduct.image = body.image;
      }

      if (!updatedProduct) {
        throw new NotFoundException('Product not found');
      }

      updatedProduct.title = body.title;
      updatedProduct.category = body.category;
      updatedProduct.price = body.price;
      updatedProduct.quantity = body.quantity;
      await updatedProduct.save();

      return {
        status: 'success',
        data: updatedProduct,
        HttpStatusCode: HttpStatus.OK,
      };
    } catch (error) {
      return {
        status: 'error',
        HttpStatusCode: HttpStatus.OK,
      };
    }
  }

  async deleteProduct(id: string, res: Response): Promise<void> {
    const product = await this.productModel.findByIdAndDelete(id);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
    } else {
      res.status(200).json({ msg: 'Product deleted successfully' });
    }
  }
}
