import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order_item.entity';
import { OrderItemController } from './order_item.controller';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order,OrderItem]), ProductModule],
  controllers: [OrdersController, OrderItemController],
  providers: [OrdersService],
})
export class OrdersModule {}
