import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateCategoryDto{
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsUUID()
    groupName: string;

    @IsString()
    image_url: string;
}