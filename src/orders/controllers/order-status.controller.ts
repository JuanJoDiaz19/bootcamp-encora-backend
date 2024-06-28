import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { OrdersService } from "../services/orders.service";
import { OrderStatus } from "../entities/order-status.entity";
import { CreateStatusDto } from "../dto/create-status.dto";
import { DeleteResult } from "typeorm";
import { UpdateStatusDto } from "../dto/update-status.dto";

@ApiTags('status')
@Controller('status')
export class StatusController {
    constructor(private readonly ordersService: OrdersService) {}

    @ApiOperation({ summary: 'Create a new order status' })
    @ApiResponse({ status: 201, description: 'Order status successfully created', type: OrderStatus })
    @Post()
    createStatus(@Body() createStatusDto: CreateStatusDto): Promise<OrderStatus> {
        return this.ordersService.createStatus(createStatusDto);
    }

    @ApiOperation({ summary: 'Get all order statuses' })
    @ApiQuery({ name: 'page', required: false, description: 'Page number for pagination' })
    @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page for pagination' })
    @ApiResponse({ status: 200, description: 'List of order statuses with pagination', type: [OrderStatus] })
    @Get()
    getAllStatus(@Query('page') page: string, @Query('limit') limit: string): Promise<[OrderStatus[], number]> {
        return this.ordersService.getAllStatus(page, limit);
    }

    @ApiOperation({ summary: 'Get order status by name' })
    @ApiResponse({ status: 200, description: 'Order status found', type: OrderStatus })
    @ApiResponse({ status: 404, description: 'Order status not found' })
    @Get(':name')
    getStatusById(@Param('name') name: string): Promise<OrderStatus> {
        return this.ordersService.getStatusByName(name);
    }

    @ApiOperation({ summary: 'Update order status by ID' })
    @ApiResponse({ status: 200, description: 'Order status successfully updated', type: OrderStatus })
    @ApiResponse({ status: 404, description: 'Order status not found' })
    @Patch(':id')
    updateStatus(@Param('id') id: string, @Body() updateStatusDto: UpdateStatusDto): Promise<OrderStatus> {
        return this.ordersService.updateStatus(id, updateStatusDto);
    }

    @ApiOperation({ summary: 'Delete order status by ID' })
    @ApiResponse({ status: 200, description: 'Order status successfully deleted', type: DeleteResult })
    @ApiResponse({ status: 404, description: 'Order status not found' })
    @Delete(':id')
    deleteStatus(@Param('id') id: string): Promise<DeleteResult> {
        return this.ordersService.deleteStatus(id);
    }
}
