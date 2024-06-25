import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ShoppingCartService } from '../services/shopping_cart.service';
import { CreateShoppingCartDto } from '../dto/create-shopping_cart.dto';
import { UpdateShoppingCartDto } from '../dto/update-shopping_cart.dto';
import { ShoppingCart } from '../entities/shopping_cart.entity';
import { DeleteResult } from 'typeorm';
import { ShoppingCartResponseDto } from '../dto/response-shopping_cart.dto';

@Controller('shoppingcart')
export class ShoppingCartController {
  constructor(private readonly shoppingCartService: ShoppingCartService) {}

  @Get()
  findAll(): Promise<ShoppingCart[]> {
    return this.shoppingCartService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ShoppingCart> {
    return this.shoppingCartService.findOne(id);
  }
  @Post(':id')
  buy(@Param('id') id: string):Promise<String>{
    return this.shoppingCartService.buy(id);
  } 

  @Get('user/:userId')
  findOneByUser(@Param('userId') userId: string) {
    return this.shoppingCartService.findOneByUser(userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateShoppingCartDto: UpdateShoppingCartDto): Promise<ShoppingCartResponseDto> {
    return this.shoppingCartService.update(id, updateShoppingCartDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shoppingCartService.remove(id);
  }
}
