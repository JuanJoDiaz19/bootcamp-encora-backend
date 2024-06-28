import { PartialType } from '@nestjs/mapped-types';
import { CreateReviewDto } from './create-review.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateReviewDto extends PartialType(CreateReviewDto) {

    @ApiPropertyOptional({
        description: 'The score given in the review',
        example: 4,
    })
    @IsOptional()
    @IsNumber()
    score: number;

    @ApiPropertyOptional({
        description: 'The comment provided in the review',
        example: 'Great product, highly recommended!',
    })
    @IsOptional()
    @IsString()
    comment: string;
}
