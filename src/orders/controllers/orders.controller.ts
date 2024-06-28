import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { OrdersService } from '../services/orders.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { Order } from '../entities/order.entity';
import { DeleteResult } from 'typeorm';
import { CreateResponseDto } from '../dto/create-response.dto';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order successfully created', type: Order })
  @Post()
  create(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.ordersService.create(createOrderDto);
  }

  @ApiOperation({ summary: 'Get all orders with pagination' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page for pagination' })
  @ApiResponse({ status: 200, description: 'List of orders with pagination', type: [Order] })
  @Get()
  findAll(@Query('page') page: string, @Query('limit') limit: string): Promise<[Order[], number]> {
    return this.ordersService.getAllOrders(page, limit);
  }

  @ApiOperation({ summary: 'Get an order by ID' })
  @ApiResponse({ status: 200, description: 'Order found', type: Order })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @Get('/one/:id')
  findOne(@Param('id') id: string): Promise<Order> {
    return this.ordersService.getOrderById(id);
  }

  @ApiOperation({ summary: 'Update an order by ID' })
  @ApiResponse({ status: 200, description: 'Order successfully updated', type: Order })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto): Promise<Order> {
    return this.ordersService.updateOrder(id, updateOrderDto);
  }

  @ApiOperation({ summary: 'Delete an order by ID' })
  @ApiResponse({ status: 200, description: 'Order successfully deleted', type: DeleteResult })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @Delete(':id')
  remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.ordersService.deleteOrder(id);
  }

  @ApiOperation({ summary: 'Handle PayU response' })
  @ApiResponse({ status: 200, description: 'Response successfully handled' })
  @Get('/payu-response')
  async handleResponse(@Query() data: CreateResponseDto) {
    return await this.ordersService.handleResponse(data);
  }

  @ApiOperation({ summary: 'Handle PayU confirmation' })
  @ApiResponse({ status: 200, description: 'Confirmation successfully handled' })
  @Get('/payu-confirmation')
  async handleConfirmation(@Query() data: CreateResponseDto) {
    console.log("CONFIRMATION")
    return await this.ordersService.handleResponse(data);
  }
}
