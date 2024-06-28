import { IsEmail, IsOptional, IsPhoneNumber, IsString, Matches, MaxLength, MinLength, IsDate } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {

    @ApiProperty({ description: 'The email of the user' })
    @IsEmail()
    @IsString()
    email: string;

    @ApiProperty({ description: 'The first name of the user' })
    @IsString()
    first_name: string;

    @ApiProperty({ description: 'The last name of the user' })
    @IsString()
    last_name: string;

    @ApiProperty({ 
        description: 'The password of the user',
        minLength: 6,
        maxLength: 50,
        pattern: '(?:(?=.*\\d)|(?=.*\\W+))(?![.\\n])(?=.*[A-Z])(?=.*[a-z]).*$',
    })
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have an uppercase letter, a lowercase letter, and a number'
    })
    password: string;

    @ApiProperty({ description: 'The role of the user' })
    @IsString()
    role: string;

    @ApiPropertyOptional({ description: 'The birth date of the user' })
    @IsString()
    @IsOptional()
    @IsDate()
    birth_date: Date;

}
