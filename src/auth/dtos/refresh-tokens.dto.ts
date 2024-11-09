import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    description: 'The Refresh Token of the proposed Login-User.',
    example: 'f5ba9c09-ee63-4a4a-a65e-012d9db07bbd',
  })
  @IsString()
  refreshToken: string;
}
