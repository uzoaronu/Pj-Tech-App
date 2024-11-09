import { Type } from 'class-transformer';
import { ArrayUnique, IsEnum, IsString, ValidateNested } from 'class-validator';
import { Resource } from '../enums/resource.enum';
import { Action } from '../enums/action.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({
    description: 'The name of the proposed Role.',
    example: 'seller',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Permissions that the User with this Role can carryout.',
    example: ' [{"resource":"products","actions": ["create","delete"]}]',
  })
  @ValidateNested()
  @Type(() => Permission)
  permissions: Permission[];
}

export class Permission {
  @ApiProperty({
    description: 'Resource where action can be carried out.',
    example: 'Products',
  })
  @IsEnum(Resource)
  resource: Resource;

  @ApiProperty({
    description: 'List of actions that can be carried out in this resource.',
    example: '[Read, Create]',
  })
  @IsEnum(Action, { each: true })
  @ArrayUnique() //so a user does not pass thesame action twice in a permission
  actions: Action[];
}
