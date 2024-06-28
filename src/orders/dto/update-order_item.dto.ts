import { PartialType } from "@nestjs/mapped-types";
import { CreateOrderItemDto } from "./create-order_item.dto";
import { IsInt, IsNumber, IsOptional, IsPositive, IsString, IsUUID } from "class-validator";
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateOrderItemDto extends PartialType(CreateOrderItemDto) {

    @ApiPropertyOptional({
        description: 'The quantity of the order item',
        example: 5,
    })
    @IsOptional()
    @IsNumber()
    @IsPositive()
    @IsInt()
    quantity: number;

    @ApiPropertyOptional({
        description: 'The ID of the product associated with the order item',
        example: 'a5c4b3d2-e1f0-1234-5678-9abcdef01234',
    })
    @IsOptional()
    @IsUUID()
    productId: string;
}
