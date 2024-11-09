import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schemas/product.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      //productModel
      {
        //collection name = products
        name: Product.name, //Product class name in @schema.
        schema: ProductSchema,
      },
    ]), // we import this to any module where we want to use products-model to access database
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [MongooseModule, ProductsService], //this will export all the models registered above in MongooseModule.forFeature([....])
})
export class ProductsModule {}
