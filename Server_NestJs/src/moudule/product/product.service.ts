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
  async getAllProducts(query: any, sortByCategory: any): Promise<Product[]> {
    console.log(sortByCategory);
    try {
      if (query == '' && sortByCategory == '') {
        const sortedProduct = await this.productModel.find().exec();
        return sortedProduct;
      }
      // nếu category từ client gửi lên param mà khac rỗng thì thực hiện
      if (query == 'price') {
        let sortedProduct;
        if (sortByCategory !== '') {
          sortedProduct = await this.productModel
            .find({ category: sortByCategory })
            .sort({ price: -1 })
            .exec();
        } else {
          sortedProduct = await this.productModel
            .find()
            .sort({ price: -1 })
            .exec();
        }
        return sortedProduct;
      } else if (query == 'title') {
        let sortedTitle;
        if (sortByCategory !== '') {
          sortedTitle = await this.productModel
            .find({ category: sortByCategory })
            .collation({ locale: 'en', strength: 1 }) // Đặt tùy chọn collation để không phân biệt in hoa và in thường
            .sort({ title: 1 })
            .exec();
        } else {
          sortedTitle = await this.productModel
            .find()
            .collation({ locale: 'en', strength: 1 }) // Đặt tùy chọn collation để không phân biệt in hoa và in thường
            .sort({ title: 1 })
            .exec();
        }
        return sortedTitle;
      } else if (query == 'createdAt') {
        let sortedDate;
        if (sortByCategory !== '') {
          sortedDate = await this.productModel
            .find({ category: sortByCategory })
            .sort({ createdAt: 1 })
            .exec();
        } else {
          sortedDate = await this.productModel
          .find()
          .sort({ createdAt: 1 })
          .exec();
        }
        return sortedDate;
      } else {
        const sortedProduct = await this.productModel
          .find({ category: sortByCategory })
          .exec();
        return sortedProduct;
      }
      // nếu category từ client gửi lên param mà rỗng thì thực hiện
    } catch (error) {
      console.error(error);
      return;
    }
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

  // async getSortedByPrice(res, query: any) {
  //   try {
  //     if(query == "price"){
  //       const sortedProduct = await this.productModel
  //       .find()
  //       .sort({ price: -1 })
  //       .exec();
  //     return res
  //       .status(200)
  //       .json({ msg: 'Sort By Product In Price', sortedProduct });
  //     }else{
  //       const sortedProduct = await this.productModel
  //       .find()
  //       .exec();
  //     return res
  //       .status(200)
  //       .json({ msg: 'Sort By Product In Price', sortedProduct });
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     return res.status(500).json({ msg: 'Sort By Product To Fail!' });
  //   }
  // }
}
