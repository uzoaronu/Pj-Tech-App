import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log('INSIDE AUTHENTICATION GUARD');

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Invalid token ');
    }

    try {
      const payload = this.jwtService.verify(token);
      // console.log('PAYLOAD :' + payload);
      request.userId = payload.userId;
    } catch (error) {
      Logger.error(error.message);
      throw new UnauthorizedException('Invalid Token ...not verified');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    return request.headers.authorization?.split(' ')[1];
  }
}

//!- create a Roles Module with necessary methods

//2- Create a custom @Permissions decorator

//3- create an Authorization Guard
