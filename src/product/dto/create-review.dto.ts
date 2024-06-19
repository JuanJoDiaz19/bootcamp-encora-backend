import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUUID } from "class-validator";

export class CreateReviewDto {

    @IsOptional()
    @IsNumber()
    @IsPositive()
    score: number;
    
    @IsOptional()
    @IsString()
    comment: string;

    @IsNotEmpty()
    @IsUUID()
    productId:string;
}