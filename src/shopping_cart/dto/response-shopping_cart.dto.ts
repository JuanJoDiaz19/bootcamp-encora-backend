import { ApiProperty } from '@nestjs/swagger';
import { ShoppingCartStatus } from '../entities/shopping_cart_status.entity';
import { ShoppingCartItemResponseDto } from './response-shopping_cart_item.dto';

export class ShoppingCartResponseDto {
  @ApiProperty({ description: 'The unique identifier of the shopping cart' })
  id: string;

  @ApiProperty({
    description: 'The items in the shopping cart',
    type: [ShoppingCartItemResponseDto],
  })
  items: ShoppingCartItemResponseDto[];

  @ApiProperty({ description: 'The subtotal for all items in the shopping cart' })
  sub_total: number;

  @ApiProperty({
    description: 'The status of the shopping cart',
    enum: ShoppingCartStatus,
  })
  status: ShoppingCartStatus;

  @ApiProperty({ description: 'The unique identifier of the user' })
  userId: string;
}
