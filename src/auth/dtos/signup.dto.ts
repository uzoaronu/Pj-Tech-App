import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { UserRole } from '../enums/userRole.enum';
import { Types } from 'mongoose';

export class SignUpDto {
  @ApiProperty({
    description: 'The name of the proposed User.',
    example: 'John Doe',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The Email of the proposed User.',
    example: 'John@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The role of the proposed User.',
    example: UserRole.CLIENT,
    enum: UserRole,
  })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({
    description: 'The Password of the proposed User.',
    example: 'John@123',
  })
  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*[0-9])/, {
    message: 'Password must contain atleast one number',
  })
  password: string;

  @ApiProperty({
    description: 'The Password of the proposed User.',
    example: 'John@123',
  })
  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*[0-9])/, {
    message: 'Password must contain atleast one number',
  })
  confirmPassword: string;

  @ApiProperty({
    description: 'The Role ID of the proposed User.',
    example: '609bda561c1c2c1a1c1e1b1a',
    required: false,
  })
  @IsOptional()
  roleId?: Types.ObjectId | null;

  // @ApiProperty({
  //   description: 'The Status of the proposed User.',
  //   example: '609bda561c1c2c1a1c1e1b1a',
  //   required: false,
  // })
  // @IsOptional()
  // status?: string | null;
}
