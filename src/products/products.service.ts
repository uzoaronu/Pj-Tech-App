import { Get, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schemas/product.schema';
import { Model } from 'mongoose';

@Injectable()
export class ProductsService {
  constructor(
    private configService: ConfigService,
    @InjectModel(Product.name) private ProductModel: Model<Product>,
  ) {}

  // @Get()
  // getDetails() {
  //   console.log(this.configService.get('PORT'));
  // }

  async createProduct(product: CreateProductDto) {
    const newProduct = new this.ProductModel(product);
    return newProduct.save();
  }

  async getAllProducts() {
    return this.ProductModel.find();
  }

  // findAll() {
  //   return `This action returns all products`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} product`;
  // }

  // update(id: number, updateProductDto: UpdateProductDto) {
  //   return `This action updates a #${id} product`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} product`;
  // }
}
