import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { OrdersService } from '../services/orders.service';
import { DeleteResult } from 'typeorm';
import { CreateOrderItemDto } from '../dto/create-order_item.dto';
import { OrderItem } from '../entities/order_item.entity';
import { UpdateOrderItemDto } from '../dto/update-order_item.dto';

@Controller('orderItem')
export class OrderItemController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  createOrderItem(@Body() createOrderItemDto: CreateOrderItemDto): Promise<OrderItem> {
    return this.ordersService.createOrderItem(createOrderItemDto);
  }

  @Get()
  getAllOrderItems(@Query('page') page:string, @Query('limit') limit :string): Promise<[OrderItem[], number]> {
    return this.ordersService.getAllOrderItems(page,limit);
  }

  @Get(':id')
  getOrderItemById(@Param('id') id: string): Promise<OrderItem> {
    return this.ordersService.getOrderItemById(id);
  }

  @Patch(':id')
  updateOrderItem(@Param('id') id: string, @Body() updateOrderItemDto: UpdateOrderItemDto): Promise<OrderItem> {
    return this.ordersService.updateOrderItem(id, updateOrderItemDto);
  }

  @Delete(':id')
  deleteOrderItem(@Param('id') id: string): Promise<DeleteResult> {
    return this.ordersService.deleteOrderItem(id);
  }
}
