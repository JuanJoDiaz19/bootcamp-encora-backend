import { IsArray, IsNotEmptyObject, IsObject } from "class-validator";

export class CreateOrderDto {
    @IsNotEmptyObject()
    @IsObject()
    @IsArray()
    itemsIds: string[];
}
