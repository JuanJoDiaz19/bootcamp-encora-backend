import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ShoppingCartService } from '../services/shopping_cart.service';
import { CreateShoppingCartDto } from '../dto/create-shopping_cart.dto';
import { UpdateShoppingCartDto } from '../dto/update-shopping_cart.dto';
import { ShoppingCart } from '../entities/shopping_cart.entity';
import { DeleteResult } from 'typeorm';

@Controller('shoppingcart')
export class ShoppingCartController {
  constructor(private readonly shoppingCartService: ShoppingCartService) {}

  @Post()
  create(): Promise<ShoppingCart> {
    return this.shoppingCartService.createShoppingCart();
  }

  @Get()
  findAll(): Promise<ShoppingCart[]> {
    return this.shoppingCartService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ShoppingCart> {
    return this.shoppingCartService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateShoppingCartDto: UpdateShoppingCartDto): Promise<ShoppingCart> {
    return this.shoppingCartService.update(id, updateShoppingCartDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shoppingCartService.remove(id);
  }
}
