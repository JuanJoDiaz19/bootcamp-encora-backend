import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  type: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  @IsOptional()
  @IsPositive()
  price: number;

  @IsArray()
  @IsOptional()
  existing_images: string[];

  @IsArray()
  @IsOptional()
  image_urls?: string[];

  @IsString()
  @IsOptional()
  category: string;

  @IsString()
  @IsOptional()
  @IsPositive()
  stockValue: number;
}
