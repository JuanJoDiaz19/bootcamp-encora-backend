import { IsEmail, IsOptional, IsPhoneNumber, IsString, Matches, MaxLength, MinLength } from 'class-validator';


export class CreateAddressDto {

    @IsString()
    phone_number:string;

    @IsString()
    address:string;

    @IsEmail()
    @IsString()
    zip_code:string;

    @IsString()
    @IsOptional()
    city_name:string

}
