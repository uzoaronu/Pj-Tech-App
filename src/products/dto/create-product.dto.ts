import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'The name of the proposed Product.',
    example: 'Tales by moonlight',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The Price of the proposed Product.',
    example: 12,
  })
  @IsInt()
  price: number;

  @ApiProperty({
    description: 'The description of the proposed Product.',
    example: 'the best selling folktale in Nigeria',
  })
  @IsString()
  description: string;
}
