import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { OrdersService } from "../services/orders.service";
import { CreatePaymentMethodDto } from "../dto/create-payment_method.dto";
import { PaymentMethod } from "../entities/payment_method.entity";
import { DeleteResult } from "typeorm";
import { UpdatePaymentMethodDto } from "../dto/update-payment_method.dto";

@Controller('payment_method')
export class PaymentMethodController{
    constructor(private readonly ordersService: OrdersService){}

    @Post()
    createPaymentMethod(@Body() createPaymentMethodDto: CreatePaymentMethodDto): Promise<PaymentMethod> {
        return this.ordersService.createPaymentMethod(createPaymentMethodDto);
    }

    @Get()
    getAllPaymentMethods(@Query('page') page:string, @Query('limit') limit :string): Promise<[PaymentMethod[], number]> {
        return this.ordersService.getAllPaymentMethods(page,limit);
    }

    @Get(':id')
    getPaymentMethodById(@Param('id') id: string): Promise<PaymentMethod> {
        return this.ordersService.getPaymentMethodById(id);
    }

    @Patch(':id')
    updatePaymentMethod(@Param('id') id: string, @Body() updatePaymentMethodDto: UpdatePaymentMethodDto): Promise<PaymentMethod> {
        return this.ordersService.updatePaymentMethod(id, updatePaymentMethodDto);
    }

    @Delete(':id')
    deletePaymentMethod(@Param('id') id: string): Promise<DeleteResult> {
        return this.ordersService.deletePaymentMethod(id);
    }
}