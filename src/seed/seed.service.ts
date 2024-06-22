import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/auth/entities/role.entity';
import { User } from 'src/auth/entities/user.entity';
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
import { Repository } from 'typeorm';


@Injectable()
export class SeederService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
@InjectRepository(Role) private readonly roleRepository: Repository<Role>,
@InjectRepository(Address) private readonly addressRepository: Repository<Address>,
@InjectRepository(City) private readonly cityRepository: Repository<City>,
@InjectRepository(Department) private readonly departmentRepository: Repository<Department>,
@InjectRepository(Order) private readonly orderRepository: Repository<Order>,
@InjectRepository(OrderItem) private readonly orderItemRepository: Repository<OrderItem>,
@InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
@InjectRepository(Group) private readonly groupRepository: Repository<Group>,
@InjectRepository(Product) private readonly productRepository: Repository<Product>,
@InjectRepository(Review) private readonly reviewRepository: Repository<Review>,
@InjectRepository(Stock) private readonly stockRepository: Repository<Stock>,
@InjectRepository(ShoppingCart) private readonly shoppingCartRepository: Repository<ShoppingCart>,
@InjectRepository(ShoppingCartItem) private readonly shoppingCartItemRepository: Repository<ShoppingCartItem>,
@InjectRepository(ShoppingCartStatus) private readonly shoppingCartStatusRepository: Repository<ShoppingCartStatus>,
  ) { }

  async onApplicationBootstrap(): Promise<void> {
    await this.seedData();
  }

  async seedData() {
    
  }
}
