import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../entities/product.entity';

export class InfoProductDto {
  @ApiProperty({
    description: 'The unique identifier of the product',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'The name of the product',
    example: 'Product Name',
  })
  name: string;

  @ApiProperty({
    description: 'The description of the product',
    example: 'This is a great product that offers many features.',
  })
  description: string;

  @ApiProperty({
    description: 'The price of the product',
    example: 99.99,
  })
  price: number;

  @ApiProperty({
    description: 'The URLs of the product images',
    example: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
  })
  image_urls: string[];

  @ApiProperty({
    description: 'The category of the product',
    example: 'Electronics',
  })
  category: string;

  @ApiProperty({
    description: 'The available stock of the product',
    example: 50,
  })
  stock: number;

  constructor(product: Product) {
    this.id = product.id;
    this.name = product.name;
    this.description = product.description;
    this.price = product.price;
    this.image_urls = product.image_urls;
    this.category = product.category.name;
    this.stock = product.stock.stock;
  }
}
