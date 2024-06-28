import { PartialType } from "@nestjs/mapped-types";
import { CreateStatusDto } from "./create-status.dto";
import { IsOptional, IsString } from "class-validator";
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateStatusDto extends PartialType(CreateStatusDto) {

    @ApiPropertyOptional({
        description: 'The name of the status',
        example: 'Shipped',
    })
    @IsOptional()
    @IsString()
    name: string;
}
