import { IsEmail, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAddressDto {

    @ApiProperty({ description: 'Phone number of the user' })
    @IsString()
    phone_number: string;

    @ApiProperty({ description: 'Address of the user' })
    @IsString()
    address: string;

    @ApiProperty({ description: 'Zip code of the address' })
    @IsEmail()
    @IsString()
    zip_code: string;

    @ApiProperty({ description: 'City name of the address', required: false })
    @IsString()
    @IsOptional()
    city_name: string;
}
