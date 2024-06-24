import { Module } from '@nestjs/common';
import { ShoppingCartService } from './services/shopping_cart.service';
import { ShoppingCartController } from './controllers/shopping_cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShoppingCart } from './entities/shopping_cart.entity';
import { ShoppingCartItem } from './entities/shopping_cart_item.entity';
import { ProductModule } from 'src/product/product.module';
import { PaymentService } from './services/payment.service';
import { ConfigModule } from '@nestjs/config';
import { ShoppingCartStatus } from './entities/shopping_cart_status.entity';
import { OrdersModule } from 'src/orders/orders.module';
//import { CartItem } from './entities/shopping_cart_item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [ShoppingCart, ShoppingCartStatus, ShoppingCartItem]), ProductModule,ConfigModule,
    OrdersModule
    ],
  controllers: [ShoppingCartController],
  providers: [ShoppingCartService, PaymentService],
  exports:[ShoppingCartService],
})
export class ShoppingCartModule {}
