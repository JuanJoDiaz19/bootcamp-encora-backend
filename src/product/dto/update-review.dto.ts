import { PartialType } from '@nestjs/mapped-types';
import { CreateReviewDto } from './create-review.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateReviewDto extends PartialType(CreateReviewDto) {

    @IsOptional()
    @IsNumber()
    score: number;

    @IsOptional()
    @IsString()
    comment: string;
}
