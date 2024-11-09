import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/schemas/user.schema';
import {
  RefreshToken,
  RefreshTokenSchema,
} from './schemas/refresh-token.schema';
import { RolesModule } from 'src/roles/roles.module';
import { UserRoleSchema, UserRoles } from './userRoles/userRoles.schema';

@Module({
  imports: [
    RolesModule,
    MongooseModule.forFeature([
      {
        name: UserRoles.name,
        schema: UserRoleSchema,
      },
      {
        name: RefreshToken.name,
        schema: RefreshTokenSchema,
      },
    ]), //registering the Model we want to use in this module
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
