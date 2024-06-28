import { IsBoolean, IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendPQR {

    @ApiProperty({ description: 'Description of the PQR' })
    @IsString()
    description: string;


    @ApiProperty({ description: 'The email of the user' })
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'Name of the user' })
    @IsString()
    name: string;


    @ApiProperty({ description: 'Is the privacy policy checked' })
    @IsBoolean()
    privacyPolicy: boolean;

    @ApiProperty({ description: 'Type of the PQR' })
    @IsString()
    type: string;
}
