import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateReviewDto {
  @IsNumber()
  @IsPositive()
  score: number;

  @IsString()
  comment: string;

  @IsString()
  title: string;

  @IsDate()
  publication_date: Date;

  @IsNotEmpty()
  @IsUUID()
  productId: string;

  @IsNotEmpty()
  @IsUUID()
  userId: string;
}
