import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';
import { PERMISSIONS_KEY } from 'src/decorators/permissions.decorators';
import { Permission } from 'src/roles/dtos/role.dto';

//will take care of our permissions needed
//this Guard will check the roles n permission of the user and compare it with the  role and permission of the route
@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('INSIDE AUTHORIZATION GUARD');
    const request = context.switchToHttp().getRequest();

    if (!request.userId) {
      throw new UnauthorizedException('User Id not found');
    }

    const routePermissions: Permission[] = this.reflector.getAllAndOverride(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    console.log(`the route permissions are ${routePermissions}`);

    // if (!routePermissions) {
    //   return true;
    // }

    //TODO: Get User's Permissions
    try {
      const userPermissions = await this.authService.getUserPermissions(
        request.userId,
      );
      console.log(`the user permissions are ${userPermissions}`);

      for (const routePermission of routePermissions) {
        const userPermission = userPermissions.find(
          (perm) => perm.resource === routePermission.resource,
        );

        if (!userPermission) throw new ForbiddenException();

        const allActionsAvailable = routePermission.actions.every(
          (requiredAction) => userPermission.actions.includes(requiredAction),
        );
        if (!allActionsAvailable) throw new ForbiddenException();
      }
    } catch (error) {
      throw new ForbiddenException('probleeem');
    }

    return true;
  }
}
