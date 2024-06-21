import { PartialType } from "@nestjs/mapped-types";
import { CreateOrderItemDto } from "./create-order_item.dto";
import { IsInt, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class UpdateOrderItemDto extends PartialType(CreateOrderItemDto) {

    @IsOptional()
    @IsNumber()
    @IsPositive()
    @IsInt()
    quantity: number

    @IsOptional()
    @IsString()
    productId: string;
}
