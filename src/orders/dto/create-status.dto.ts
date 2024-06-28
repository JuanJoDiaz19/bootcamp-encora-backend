import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateStatusDto {
    @ApiProperty({
        description: 'The name of the status',
        example: 'Pending'
    })
    @IsNotEmpty()
    @IsString()
    name: string;
}
