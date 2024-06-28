import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import {
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiPropertyOptional({
    description: 'The name of the product',
    example: 'Running Shoes',
  })
  @IsString()
  @IsOptional()
  name: string;

  @ApiPropertyOptional({
    description: 'The type of the product',
    example: 'Footwear',
  })
  @IsString()
  @IsOptional()
  type: string;

  @ApiPropertyOptional({
    description: 'The description of the product',
    example: 'High-quality running shoes for daily use',
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiPropertyOptional({
    description: 'The price of the product',
    example: 79.99,
  })
  @IsNumber()
  @IsOptional()
  @IsPositive()
  price: number;

  @ApiPropertyOptional({
    description: 'Existing images of the product',
    example: ['https://example.com/images/shoe1.jpg', 'https://example.com/images/shoe2.jpg'],
  })
  @IsArray()
  @IsOptional()
  existing_images: string[];

  @ApiPropertyOptional({
    description: 'New images of the product',
    example: ['https://example.com/images/shoe3.jpg', 'https://example.com/images/shoe4.jpg'],
  })
  @IsArray()
  @IsOptional()
  image_urls?: string[];

  @ApiPropertyOptional({
    description: 'The category of the product',
    example: 'Sportswear',
  })
  @IsString()
  @IsOptional()
  category: string;

  @ApiPropertyOptional({
    description: 'The stock value of the product',
    example: 100,
  })
  @IsNumber()
  @IsOptional()
  @IsPositive()
  stockValue: number;
}
