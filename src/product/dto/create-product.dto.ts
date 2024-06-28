import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    description: 'The name of the product',
    example: 'Laptop',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The type of the product',
    example: 'Electronics',
    required: false,
  })
  @IsOptional()
  @IsString()
  type: string;

  @ApiProperty({
    description: 'A brief description of the product',
    example: 'A high-performance laptop suitable for gaming and work.',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'The price of the product',
    example: 1500,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({
    description: 'A list of image URLs for the product',
    example: ['https://example.com/images/laptop1.png', 'https://example.com/images/laptop2.png'],
  })
  @IsArray()
  @IsString({ each: true })
  image_urls: string[];

  @ApiProperty({
    description: 'The category of the product',
    example: 'Computers',
  })
  @IsNotEmpty()
  @IsString()
  category: string;

  @ApiProperty({
    description: 'The available stock of the product',
    example: 100,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  stock: number;
}
