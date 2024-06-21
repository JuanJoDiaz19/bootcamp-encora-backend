import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { OrdersService } from "../services/orders.service";
import { Status } from "../entities/status.entity";
import { CreateStatusDto } from "../dto/create-status.dto";
import { DeleteResult } from "typeorm";
import { UpdateStatusDto } from "../dto/update-status.dto";

@Controller('status')
export class StatusController{
    constructor(private readonly ordersService: OrdersService){}

    @Post()
    createStatus(@Body() createStatusDto: CreateStatusDto): Promise<Status>{
        return this.ordersService.createStatus(createStatusDto);
    }

    @Get()
    getAllStatus(@Query('page') page: string, @Query('limit') limit: string): Promise<[Status[],number]>{
        return this.ordersService.getAllStatus(page,limit);
    }

    @Get(':id')
    getStatusById(@Param('id') id:string):Promise<Status>{
        return this.ordersService.getStatusById(id);
    }

    @Patch(':id')
    updateStatus(@Param('id') id:string, @Body() updateStatusDto: UpdateStatusDto): Promise<Status>{
        return this.ordersService.updateStatus(id, updateStatusDto);
    }

    @Delete(':id')
    deleteStatus(@Param('id') id:string): Promise<DeleteResult>{
        return this.ordersService.deleteStatus(id);
    }
}