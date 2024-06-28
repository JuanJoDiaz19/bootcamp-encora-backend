import { ApiProperty } from '@nestjs/swagger';

export class ShoppingCartItemResponseDto {
  @ApiProperty({ description: 'The unique identifier of the shopping cart item' })
  id: string;

  @ApiProperty({ description: 'The unique identifier of the product' })
  productId: string;

  @ApiProperty({ description: 'The quantity of the product in the shopping cart item' })
  quantity: number;

  @ApiProperty({ description: 'The price of the product' })
  price: number;

  @ApiProperty({ description: 'The subtotal for the product in the shopping cart item' })
  sub_total: number;
}
