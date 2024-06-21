import { IsArray, IsNotEmpty, IsObject, IsString } from "class-validator";

export class CreateOrderDto {
    @IsNotEmpty()
    @IsArray()
    itemsIds: string[];
}
