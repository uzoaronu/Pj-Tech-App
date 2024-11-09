import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'The Email of the proposed Login-User.',
    example: 'jerry@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The Password of the proposed Login-User.',
    example: 'Jerry@123',
  })
  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*[0-9])/, {
    message: 'Password must contain atleast one number',
  })
  password: string;
}
