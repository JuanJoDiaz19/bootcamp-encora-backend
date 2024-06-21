import { PartialType } from "@nestjs/mapped-types";
import { CreatePaymentMethodDto } from "./create-payment_method.dto";
import { IsOptional, IsString } from "class-validator";

export class UpdatePaymentMethodDto extends PartialType(CreatePaymentMethodDto) {

    @IsOptional()
    @IsString()
    name: string;
}
