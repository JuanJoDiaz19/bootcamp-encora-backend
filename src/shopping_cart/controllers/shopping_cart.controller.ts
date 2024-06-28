import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ShoppingCartService } from '../services/shopping_cart.service';
import { CreateShoppingCartDto } from '../dto/create-shopping_cart.dto';
import { UpdateShoppingCartDto } from '../dto/update-shopping_cart.dto';
import { ShoppingCart } from '../entities/shopping_cart.entity';
import { DeleteResult } from 'typeorm';
import { ShoppingCartResponseDto } from '../dto/response-shopping_cart.dto';
import { ApiOperation, ApiResponse, ApiTags, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('shoppingcart')
@Controller('shoppingcart')
export class ShoppingCartController {
  constructor(private readonly shoppingCartService: ShoppingCartService) {}

  @ApiOperation({ summary: 'Get all shopping carts' })
  @ApiResponse({ status: 200, description: 'Return all shopping carts', type: [ShoppingCart] })
  @Get()
  findAll(): Promise<ShoppingCart[]> {
    return this.shoppingCartService.findAll();
  }

  @ApiOperation({ summary: 'Get a shopping cart by ID' })
  @ApiResponse({ status: 200, description: 'Return the shopping cart with the given ID', type: ShoppingCart })
  @ApiParam({ name: 'id', description: 'The ID of the shopping cart' })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<ShoppingCart> {
    return this.shoppingCartService.findOne(id);
  }

  @ApiOperation({ summary: 'Buy items in the shopping cart' })
  @ApiResponse({ status: 200, description: 'Successfully purchased items', type: String })
  @ApiParam({ name: 'userId', description: 'The ID of the user' })
  @ApiParam({ name: 'addressId', description: 'The ID of the address' })
  @Post(':userId/:addressId')
  buy(@Param('userId') userId: string, @Param('addressId') addressId: string): Promise<String> {
    return this.shoppingCartService.buy(userId, addressId);
  }

  @ApiOperation({ summary: 'Get a shopping cart by user ID' })
  @ApiResponse({ status: 200, description: 'Return the shopping cart with the given user ID', type: ShoppingCart })
  @ApiParam({ name: 'userId', description: 'The ID of the user' })
  @Get('user/:userId')
  findOneByUser(@Param('userId') userId: string) {
    return this.shoppingCartService.findOneByUser(userId);
  }

  @ApiOperation({ summary: 'Refresh the items in the shopping cart' })
  @ApiResponse({ status: 200, description: 'Successfully refreshed items' })
  @ApiParam({ name: 'userId', description: 'The ID of the user' })
  @Get('refresh/:userId')
  refreshItems(@Param('userId') userId: string) {
    return this.shoppingCartService.refreshShoppingCart(userId);
  }

  @ApiOperation({ summary: 'Update the shopping cart' })
  @ApiResponse({ status: 200, description: 'Successfully updated shopping cart', type: ShoppingCartResponseDto })
  @ApiParam({ name: 'userId', description: 'The ID of the user' })
  @ApiBody({ type: UpdateShoppingCartDto })
  @Patch(':userId')
  update(@Param('userId') id: string, @Body() updateShoppingCartDto: UpdateShoppingCartDto): Promise<ShoppingCartResponseDto> {
    return this.shoppingCartService.update(id, updateShoppingCartDto);
  }

  @ApiOperation({ summary: 'Remove an item from the shopping cart' })
  @ApiResponse({ status: 200, description: 'Successfully removed item from shopping cart', type: ShoppingCartResponseDto })
  @ApiParam({ name: 'userId', description: 'The ID of the user' })
  @ApiParam({ name: 'productId', description: 'The ID of the product' })
  @Delete(':userId/:productId')
  removeItem(@Param('userId') id: string, @Param('productId') productId: string): Promise<ShoppingCartResponseDto> {
    return this.shoppingCartService.removeProductFromCart(id, productId);
  }

  @ApiOperation({ summary: 'Remove all items from the shopping cart' })
  @ApiResponse({ status: 200, description: 'Successfully removed all items from shopping cart' })
  @ApiParam({ name: 'userId', description: 'The ID of the user' })
  @Delete(':userId')
  remove(@Param('id') id: string) {
    return this.shoppingCartService.remove(id);
  }
}
