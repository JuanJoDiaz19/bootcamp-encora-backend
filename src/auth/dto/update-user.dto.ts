import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {

    @ApiPropertyOptional({ description: 'The email of the user' })
    @IsString()
    @IsOptional()
    email?: string;

    @ApiPropertyOptional({ description: 'The first name of the user' })
    @IsString()
    @IsOptional()
    first_name?: string;

    @ApiPropertyOptional({ description: 'The last name of the user' })
    @IsString()
    @IsOptional()
    last_name?: string;

    @ApiPropertyOptional({ 
        description: 'The password of the user',
        minLength: 6,
        maxLength: 50,
        pattern: '(?:(?=.*\\d)|(?=.*\\W+))(?![.\\n])(?=.*[A-Z])(?=.*[a-z]).*$',
        example: 'P@ssw0rd'
    })
    @IsString()
    @IsOptional()
    password?: string;

    @ApiPropertyOptional({ description: 'The role of the user' })
    @IsString()
    @IsOptional()
    role?: string;

    @ApiPropertyOptional({ description: 'The birth date of the user' })
    @IsString()
    @IsOptional()
    birth_date?: Date;
}
