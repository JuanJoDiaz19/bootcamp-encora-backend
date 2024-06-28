import { PartialType } from "@nestjs/mapped-types";
import { CreatePaymentMethodDto } from "./create-payment_method.dto";
import { IsOptional, IsString } from "class-validator";
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePaymentMethodDto extends PartialType(CreatePaymentMethodDto) {

    @ApiPropertyOptional({
        description: 'The name of the payment method',
        example: 'Credit Card',
    })
    @IsOptional()
    @IsString()
    name: string;
}
