import { IsInt, IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class CreateOrderItemDto {

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    @IsInt()
    quantity: number

    @IsNotEmpty()
    @IsString()
    productId: string;

}
