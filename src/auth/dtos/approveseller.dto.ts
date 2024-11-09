import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class ApproveSellerDto {
  @ApiProperty({
    description: 'The User ID of the seller to be approved',
    example: '60f7a9b9f7852b001c5e4c8a', // Example MongoDB ObjectId
  })
  @IsMongoId()
  sellerId: Types.ObjectId;

  @ApiProperty({
    description: 'The Role ID of the seller to be approved.',
    example: '609bda561c1c2c1a1c1e1b1a',
  })
  @IsMongoId()
  roleId: Types.ObjectId;
}
