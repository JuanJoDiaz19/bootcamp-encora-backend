import { Module } from '@nestjs/common';
import { ShoppingCartService } from './shopping_cart.service';
import { ShoppingCartController } from './shopping_cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShoppingCart } from './entities/shopping_cart.entity';
import { ShoppingCartItem } from './entities/shopping_cart_item.entity';
//import { CartItem } from './entities/shopping_cart_item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [ShoppingCart, ShoppingCart, ShoppingCartItem])
    ],
  controllers: [ShoppingCartController],
  providers: [ShoppingCartService],
})
export class ShoppingCartModule {}
