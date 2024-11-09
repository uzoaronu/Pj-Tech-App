import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignUpDto } from './dtos/signup.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../user/schemas/user.schema';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dtos/login.dto';
import { ValidationError } from 'class-validator';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from './schemas/refresh-token.schema';
import { v4 as uuidv4 } from 'uuid';
import { RolesService } from 'src/roles/roles.service';
import { Role } from 'src/roles/schemas/role.schema';
import { ApproveSellerDto } from './dtos/approveseller.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<User>,
    @InjectModel(Role.name) private RoleModel: Model<Role>,
    @InjectModel(RefreshToken.name)
    private RefreshTokenModel: Model<RefreshToken>,
    private jwtservice: JwtService,
    private rolesService: RolesService,
  ) {}

  async signup(signupData: SignUpDto) {
    const { email, name, password, role } = signupData;
    //TODO Check if email is in use
    const emailInUse = await this.UserModel.findOne({
      email: email,
    });
    if (emailInUse) {
      throw new BadRequestException('Email Already in use!');
    }
    //Todo Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    //Todo: if role === admin/seller/client...,go to roles schema nd get the appropriate roleId, then infuse the role id the the newUser document we want to create:

    // Determine the appropriate roleId based on the role provided
    let userRole;
    if (role === 'seller') {
      userRole = await this.RoleModel.findOne({ name: 'seller' });
      // signupData.roleId = userRole._id;
    } else if (role === 'client') {
      userRole = await this.RoleModel.findOne({ name: 'client' });
      // signupData.roleId = userRole._id;
    } else if (role === 'admin') {
      userRole = await this.RoleModel.findOne({ name: 'admin' });
      // signupData.roleId = userRole._id;
    }

    // Check if the role was found
    if (!userRole) {
      throw new BadRequestException('Invalid role specified.');
    }

    // Set the roleId for the new user
    signupData.roleId = userRole._id;

    // Create and save the new user in the database
    let newUser;
    if (role === 'seller') {
      newUser = await this.UserModel.create({
        name: name,
        email: email,
        role: role,
        password: hashedPassword,
        roleId: userRole._id,
        status: 'inactive',
      });
      return { message: 'created New Seller in Database. Thank You', newUser };
    } else {
      newUser = await this.UserModel.create({
        name: name,
        email: email,
        role: role,
        password: hashedPassword,
        roleId: userRole._id,
        status: 'active',
      });
      return { message: 'created New User in Database. Thank You', newUser };
    }
  }

  async allInactiveSellers() {
    const result = await this.UserModel.find({
      role: 'seller',
      status: 'inactive',
    });

    return result;
  }

  //Todo: Approveseller by admin service:

  async approveSeller(approveSellerDto: ApproveSellerDto) {
    const { sellerId, roleId } = approveSellerDto;

    // Find the seller by ID and check if their role is 'seller'
    const seller = await this.UserModel.findOne({
      _id: sellerId,
      roleId: roleId,
    });
    if (!seller) {
      throw new BadRequestException('Seller not found');
    }

    // Update the seller's status to 'active'
    seller.status = 'active';
    await seller.save();

    return { message: 'Seller approved successfully', seller };
  }

  //Login Service

  async login(loginData: LoginDto) {
    const { email, password } = loginData;

    //TODO Find if user exists by email
    const user = await this.UserModel.findOne({ email: email });
    if (!user) {
      throw new UnauthorizedException('Wrong Credentials (email or password)');
    }

    //Todo compare entered password with existing password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Wrong Credentials (Password or email)');
    }

    //Generate JWT tokens
    const tokens = await this.generateUserTokens(user._id);
    return { ...tokens, userId: user._id };
  }

  async refreshTokens(refreshToken: string) {
    const token = await this.RefreshTokenModel.findOne({
      token: refreshToken,
      expiryDate: { $gte: new Date() },
    });

    if (!token) {
      throw new UnauthorizedException('Refresh Token is invalid');
    }
    return this.generateUserTokens(token.userId);
  }

  async generateUserTokens(userId) {
    const accessToken = this.jwtservice.sign({ userId }, { expiresIn: '4h' });
    const refreshToken = uuidv4();
    await this.storeRefreshToken(refreshToken, userId);
    return { accessToken, refreshToken };
  }

  async storeRefreshToken(token: string, userId) {
    //Calculate expiry date 3 days from now
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 3);

    await this.RefreshTokenModel.updateOne(
      { userId },
      { $set: { expiryDate, token } },
      { upsert: true },
    );
  }

  async getUserPermissions(userId: string) {
    const user = await this.UserModel.findById(userId);

    if (!user) throw new BadRequestException();

    const role = await this.rolesService.getRoleById(user.roleId.toString());
    return role.permissions;
  }
}
