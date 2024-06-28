import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { OrdersService } from "../services/orders.service";
import { CreatePaymentMethodDto } from "../dto/create-payment_method.dto";
import { PaymentMethod } from "../entities/payment_method.entity";
import { DeleteResult } from "typeorm";
import { UpdatePaymentMethodDto } from "../dto/update-payment_method.dto";

@ApiTags('payment_method')
@Controller('payment_method')
export class PaymentMethodController{
    constructor(private readonly ordersService: OrdersService){}

    @ApiOperation({ summary: 'Create a new payment method' })
    @ApiResponse({ status: 201, description: 'Payment method successfully created', type: PaymentMethod })
    @Post()
    createPaymentMethod(@Body() createPaymentMethodDto: CreatePaymentMethodDto): Promise<PaymentMethod> {
        return this.ordersService.createPaymentMethod(createPaymentMethodDto);
    }

    @ApiOperation({ summary: 'Get all payment methods with pagination' })
    @ApiQuery({ name: 'page', required: false, description: 'Page number for pagination' })
    @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page for pagination' })
    @ApiResponse({ status: 200, description: 'List of payment methods with pagination', type: [PaymentMethod] })
    @Get()
    getAllPaymentMethods(@Query('page') page:string, @Query('limit') limit :string): Promise<[PaymentMethod[], number]> {
        return this.ordersService.getAllPaymentMethods(page, limit);
    }

    @ApiOperation({ summary: 'Get a payment method by ID' })
    @ApiResponse({ status: 200, description: 'Payment method found', type: PaymentMethod })
    @ApiResponse({ status: 404, description: 'Payment method not found' })
    @Get(':id')
    getPaymentMethodById(@Param('id') id: string): Promise<PaymentMethod> {
        return this.ordersService.getPaymentMethodById(id);
    }

    @ApiOperation({ summary: 'Update a payment method by ID' })
    @ApiResponse({ status: 200, description: 'Payment method successfully updated', type: PaymentMethod })
    @ApiResponse({ status: 404, description: 'Payment method not found' })
    @Patch(':id')
    updatePaymentMethod(@Param('id') id: string, @Body() updatePaymentMethodDto: UpdatePaymentMethodDto): Promise<PaymentMethod> {
        return this.ordersService.updatePaymentMethod(id, updatePaymentMethodDto);
    }

    @ApiOperation({ summary: 'Delete a payment method by ID' })
    @ApiResponse({ status: 200, description: 'Payment method successfully deleted', type: DeleteResult })
    @ApiResponse({ status: 404, description: 'Payment method not found' })
    @Delete(':id')
    deletePaymentMethod(@Param('id') id: string): Promise<DeleteResult> {
        return this.ordersService.deletePaymentMethod(id);
    }
}
