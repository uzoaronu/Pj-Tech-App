import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/signup.dto';
import { LoginDto } from './dtos/login.dto';
import { RefreshTokenDto } from './dtos/refresh-tokens.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from 'src/user/schemas/user.schema';
import { Types } from 'mongoose';

import { ApproveSellerDto } from './dtos/approveseller.dto';
import { Permissions } from 'src/decorators/permissions.decorators';
import { UserRole } from './enums/userRole.enum';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { AuthorizationGuard } from 'src/guards/authorization.guard';
import { Resource } from 'src/roles/enums/resource.enum';
import { Action } from 'src/roles/enums/action.enum';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //TODO: POST SignUP .../auth/signup
  @Post('signup')
  @ApiCreatedResponse({
    description: 'Created User object as Response',
    type: SignUpDto,
  })
  @ApiBadRequestResponse({ description: 'User Cannot Register. Try again' })
  async signUp(@Body() signupData: SignUpDto) {
    return this.authService.signup(signupData);
  }

  //TODO: Get all InActive Sellers:
  @Get('allinactivesellers')
  async allInactiveSellers() {
    return this.authService.allInactiveSellers();
  }

  //TODO: Activate Seller by Id:
  @UseGuards(AuthenticationGuard, AuthorizationGuard) // Ensures only authenticated admins can access
  @Patch('approve-seller')
  @Permissions([
    { resource: Resource.approve, actions: [Action.approveseller] },
  ])
  async approveSeller(@Body() approveSellerDto: ApproveSellerDto) {
    return this.authService.approveSeller(approveSellerDto);
  }

  //TODO: POST Login
  @ApiCreatedResponse({
    description: 'Logged in User object as Response',
    type: LoginDto,
  })
  @ApiBadRequestResponse({ description: 'User Cannot Log in. Try again' })
  @Post('login')
  async login(@Body() loginData: LoginDto) {
    return this.authService.login(loginData);
  }

  //TODO: Refresh Token
  @Post('refresh')
  async refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto.refreshToken);
  }
}
