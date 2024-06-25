import { Module } from '@nestjs/common';
import { OrdersService } from './services/orders.service';
import { OrdersController } from './controllers/orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order_item.entity';
import { OrderItemController } from './controllers/order_item.controller';
import { ProductModule } from 'src/product/product.module';
import { OrderStatus } from './entities/order-status.entity';
import { PaymentMethod } from './entities/payment_method.entity';
import { StatusController } from './controllers/order-status.controller';
import { PaymentMethodController } from './controllers/payment_method.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Order,OrderItem, OrderStatus, PaymentMethod]), ProductModule],
  controllers: [OrdersController, OrderItemController, StatusController, PaymentMethodController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
