import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsIn, IsString, IsUUID } from 'class-validator';

export class UpdateShoppingCartDto {
  @ApiProperty({
    description: 'Array of product IDs to add or remove',
    type: [String],
    format: 'uuid',
  })
  @IsArray()
  @IsUUID('4', { each: true })
  productIds: string[];

  @ApiProperty({
    description: 'Operation to perform on the shopping cart',
    enum: ['add', 'remove'],
  })
  @IsString()
  @IsIn(['add', 'remove'])
  operation: 'add' | 'remove';
}
