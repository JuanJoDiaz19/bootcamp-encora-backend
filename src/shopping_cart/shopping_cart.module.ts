import { Module } from '@nestjs/common';
import { ShoppingCartService } from './shopping_cart.service';
import { ShoppingCartController } from './shopping_cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShoppingCart } from './entities/shopping_cart.entity';
import { ShoppingCartItem } from './entities/shopping_cart_item.entity';
import { ProductModule } from 'src/product/product.module';
import { PaymentService } from './payment.service';
import { ConfigModule } from '@nestjs/config';
import { ShoppingCartStatus } from './entities/shopping_cart_status.entity';
//import { CartItem } from './entities/shopping_cart_item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [ShoppingCart, ShoppingCartStatus, ShoppingCartItem]), ProductModule,ConfigModule,
    ],
  controllers: [ShoppingCartController],
  providers: [ShoppingCartService, PaymentService],
  exports:[ShoppingCartService],
})
export class ShoppingCartModule {}
