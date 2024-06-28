import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { IsArray, IsDate, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {

    @ApiPropertyOptional({
        description: 'The date when the order was shipped',
        example: '2023-05-25T10:00:00Z',
    })
    @IsOptional()
    @IsDate()
    shipment_date: Date;

    @ApiPropertyOptional({
        description: 'The date when the order was received',
        example: '2023-06-01T10:00:00Z',
    })
    @IsOptional()
    @IsDate()
    received_date: Date;

    @ApiPropertyOptional({
        description: 'Array of item IDs associated with the order',
        example: ['a5c4b3d2-e1f0-1234-5678-9abcdef01234', 'b6d7e8f1-2345-6789-abcdef-0123456789ab'],
    })
    @IsOptional()
    @IsArray()
    itemsIds: string[];
}
