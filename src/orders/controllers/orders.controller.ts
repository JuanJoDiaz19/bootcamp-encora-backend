import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res } from '@nestjs/common';
import { OrdersService } from '../services/orders.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { Order } from '../entities/order.entity';
import { DeleteResult } from 'typeorm';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  findAll(@Query('page') page:string, @Query('limit') limit :string): Promise<[Order[], number]> {
    return this.ordersService.getAllOrders(page,limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Order> {
    return this.ordersService.getOrderById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto): Promise<Order> {
    return this.ordersService.updateOrder(id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.ordersService.deleteOrder(id);
  }

  @Get('payu-response')
  async handleResponse(@Query() referenceCode:string, @Query() message:string, @Res() res: Response,) {
    console.log("hola",res)
    return await this.ordersService.handleResponse(referenceCode,message);
  }

  @Get('payu-confirmation')
  async handleConfirmation(@Query() referenceCode:string, @Query() message:string,@Res() res: Response,) {
    console.log("hola",res)
    return await this.ordersService.handleResponse(referenceCode,message);
  }
}
