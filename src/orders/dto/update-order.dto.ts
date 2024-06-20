import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { IsArray, IsDate, IsObject, IsOptional } from 'class-validator';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {

    @IsOptional()
    @IsDate()
    shipment_date: Date;

    @IsOptional()
    @IsDate()
    received_date: Date;

    @IsOptional()
    @IsObject()
    @IsArray()
    itemsIds: string[];
}
