import { IsEmail, IsOptional, IsPhoneNumber, IsString, Matches, MaxLength, MinLength } from 'class-validator';


export class CreateUserDto {

    @IsEmail()
    @IsString()
    email:string;

    @IsString()
    first_name:string;

    @IsString()
    last_name:string;

    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;

    @IsString()
    role:string;

    @IsString()
    @IsOptional()
    birth_date: Date;

}
