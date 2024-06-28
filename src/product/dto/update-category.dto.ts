import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateCategoryDto } from './create-category.dto';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @ApiPropertyOptional({
    description: 'The name of the category',
    example: 'Electronics',
  })
  @IsOptional()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'The description of the category',
    example: 'Category for all electronic products',
  })
  @IsOptional()
  @IsString()
  description: string;

  @ApiPropertyOptional({
    description: 'The ID of the group to which the category belongs',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsUUID()
  groupId: string;

  @ApiPropertyOptional({
    description: 'The URL of the category image',
    example: 'https://example.com/images/category.jpg',
  })
  @IsOptional()
  @IsString()
  image_url: string;

  @ApiPropertyOptional({
    description: 'The existing image URL of the category',
    example: 'https://example.com/images/existing_category.jpg',
  })
  @IsOptional()
  @IsString()
  existing_image: string;
}
