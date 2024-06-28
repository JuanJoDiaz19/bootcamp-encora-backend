import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({
    description: 'The score of the review',
    example: 4.5,
  })
  @IsNumber()
  @IsPositive()
  score: number;

  @ApiProperty({
    description: 'The comment of the review',
    example: 'This product is amazing!',
  })
  @IsString()
  comment: string;

  @ApiProperty({
    description: 'The title of the review',
    example: 'Great Product',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The publication date of the review',
    example: '2023-06-25T00:00:00Z',
  })
  @IsDate()
  publication_date: Date;

  @ApiProperty({
    description: 'The ID of the product being reviewed',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty()
  @IsUUID()
  productId: string;

  @ApiProperty({
    description: 'The ID of the user who wrote the review',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty()
  @IsUUID()
  userId: string;
}
