import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { OrdersModule } from './orders/orders.module';
import { ShoppingCartModule } from './shopping_cart/shopping_cart.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [AuthModule, CommonModule, OrdersModule, ShoppingCartModule, ProductModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
