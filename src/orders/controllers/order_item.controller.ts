import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { OrdersService } from '../services/orders.service';
import { DeleteResult } from 'typeorm';
import { CreateOrderItemDto } from '../dto/create-order_item.dto';
import { OrderItem } from '../entities/order_item.entity';
import { UpdateOrderItemDto } from '../dto/update-order_item.dto';

@ApiTags('orderItem')
@Controller('orderItem')
export class OrderItemController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({ summary: 'Create a new order item' })
  @ApiResponse({ status: 201, description: 'Order item successfully created', type: OrderItem })
  @Post()
  createOrderItem(@Body() createOrderItemDto: CreateOrderItemDto): Promise<OrderItem> {
    return this.ordersService.createOrderItem(createOrderItemDto);
  }

  @ApiOperation({ summary: 'Get all order items' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page for pagination' })
  @ApiResponse({ status: 200, description: 'List of order items with pagination', type: [OrderItem] })
  @Get()
  getAllOrderItems(@Query('page') page:string, @Query('limit') limit :string): Promise<[OrderItem[], number]> {
    return this.ordersService.getAllOrderItems(page, limit);
  }

  @ApiOperation({ summary: 'Get order item by ID' })
  @ApiResponse({ status: 200, description: 'Order item found', type: OrderItem })
  @ApiResponse({ status: 404, description: 'Order item not found' })
  @Get(':id')
  getOrderItemById(@Param('id') id: string): Promise<OrderItem> {
    return this.ordersService.getOrderItemById(id);
  }

  @ApiOperation({ summary: 'Update order item by ID' })
  @ApiResponse({ status: 200, description: 'Order item successfully updated', type: OrderItem })
  @ApiResponse({ status: 404, description: 'Order item not found' })
  @Patch(':id')
  updateOrderItem(@Param('id') id: string, @Body() updateOrderItemDto: UpdateOrderItemDto): Promise<OrderItem> {
    return this.ordersService.updateOrderItem(id, updateOrderItemDto);
  }

  @ApiOperation({ summary: 'Delete order item by ID' })
  @ApiResponse({ status: 200, description: 'Order item successfully deleted', type: DeleteResult })
  @ApiResponse({ status: 404, description: 'Order item not found' })
  @Delete(':id')
  deleteOrderItem(@Param('id') id: string): Promise<DeleteResult> {
    return this.ordersService.deleteOrderItem(id);
  }
}
