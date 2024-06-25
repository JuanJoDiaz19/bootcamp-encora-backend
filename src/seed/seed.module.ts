import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './seed.service';
import { User } from 'src/auth/entities/user.entity';
import { Role } from 'src/auth/entities/role.entity';
import { Address } from 'src/common/entities/Address.entity';
import { City } from 'src/common/entities/City.entity';
import { Department } from 'src/common/entities/Department.entity';
import { Order } from 'src/orders/entities/order.entity';
import { OrderItem } from 'src/orders/entities/order_item.entity';
import { Category } from 'src/product/entities/category.entity';
import { Group } from 'src/product/entities/group.entity';
import { Product } from 'src/product/entities/product.entity';
import { Review } from 'src/product/entities/review.entity';
import { Stock } from 'src/product/entities/stock.entity';
import { ShoppingCart } from 'src/shopping_cart/entities/shopping_cart.entity';
import { ShoppingCartItem } from 'src/shopping_cart/entities/shopping_cart_item.entity';
import { ShoppingCartStatus } from 'src/shopping_cart/entities/shopping_cart_status.entity';
import { OrderStatus } from 'src/orders/entities/order-status.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User, 
      Role, 
      Address, 
      City, 
      Department, 
      Order, 
      OrderItem, 
      Category, 
      Group, 
      Product, 
      Review, 
      Stock, 
      ShoppingCart, 
      ShoppingCartItem, 
      ShoppingCartStatus,
      OrderStatus,
    ]),
  ],
  providers: [SeederService],
  controllers: [],
})
export class SeederModule {}
