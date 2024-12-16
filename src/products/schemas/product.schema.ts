import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

//defining the Product schema structure
@Schema({ timestamps: true, versionKey: false })
export class Product {
  //products will be the collection name
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  description: string;
}

//Creating the Product Schema
export const ProductSchema = SchemaFactory.createForClass(Product);

//NB> Schemas are used to define MODELS. Models are responsible for creating and reading documents from the underlying MongoDB database
