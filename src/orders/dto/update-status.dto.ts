import { PartialType } from "@nestjs/mapped-types";
import { CreateStatusDto } from "./create-status.dto";
import { IsOptional, IsString } from "class-validator";

export class UpdateStatusDto extends PartialType(CreateStatusDto) {

    @IsOptional()
    @IsString()
    name: string;
}
