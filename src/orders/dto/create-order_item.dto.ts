import { IsInt, IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderItemDto {

    @ApiProperty({
        description: 'The quantity of the product to be ordered',
        example: 5,
        minimum: 1,
        type: Number
    })
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    @IsInt()
    quantity: number;

    @ApiProperty({
        description: 'The ID of the product to be ordered',
        example: '1234567890abcdef12345678',
        type: String
    })
    @IsNotEmpty()
    @IsString()
    productId: string;

}
