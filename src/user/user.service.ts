import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { Product } from 'src/products/schemas/product.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<User>,
    @InjectModel(Product.name) private ProductModel: Model<Product>,
  ) {}

  async createUser(createUser: CreateUserDto) {
    const { email, name, password } = createUser;
    //TODO Check if email is in use
    const emailInUse = await this.UserModel.findOne({
      email: email,
    });
    if (emailInUse) {
      throw new BadRequestException('Email Already in use!');
    }
    //Todo Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    //Todo Create User document and save in Mongodb
    await this.UserModel.create({
      name: name,
      email: email,
      password: hashedPassword,
    });
    return { message: 'created New User in Database. Thank You' };
  }

  async activateSeller(userId: Types.ObjectId): Promise<User> {
    const user = await this.UserModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.status = 'active';
    return await user.save();
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
