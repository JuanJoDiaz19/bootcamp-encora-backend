import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { OrdersService } from "../services/orders.service";
import { OrderStatus } from "../entities/order-status.entity";
import { CreateStatusDto } from "../dto/create-status.dto";
import { DeleteResult } from "typeorm";
import { UpdateStatusDto } from "../dto/update-status.dto";

@Controller('status')
export class StatusController{
    constructor(private readonly ordersService: OrdersService){}

    @Post()
    createStatus(@Body() createStatusDto: CreateStatusDto): Promise<OrderStatus>{
        return this.ordersService.createStatus(createStatusDto);
    }

    @Get()
    getAllStatus(@Query('page') page: string, @Query('limit') limit: string): Promise<[OrderStatus[],number]>{
        return this.ordersService.getAllStatus(page,limit);
    }

    @Get(':name')
    getStatusById(@Param('name') name:string):Promise<OrderStatus>{
        return this.ordersService.getStatusByName(name);
    }

    @Patch(':id')
    updateStatus(@Param('id') id:string, @Body() updateStatusDto: UpdateStatusDto): Promise<OrderStatus>{
        return this.ordersService.updateStatus(id, updateStatusDto);
    }

    @Delete(':id')
    deleteStatus(@Param('id') id:string): Promise<DeleteResult>{
        return this.ordersService.deleteStatus(id);
    }
}