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
import { Repository, getConnection } from 'typeorm';
import groups from './data/group.data';
import categories from './data/category.data';
import departments from './data/department.data';
import cities from './data/city.data';
import roles from './data/role.data';
import users from './data/user.data';
import * as bcrypt from 'bcrypt';
import products from './data/product.data';
import shoppingCartStatus from './data/shopping-cart-status.data';
import { OrderStatus } from 'src/orders/entities/order-status.entity';
import reviews from './data/review.data';
import addresses from './data/address.data';
import shopping_cart_items from './data/shopping-cart-item.data';
import orderStatus from './data/order-status.data';
import payment_methods from './data/payment-method.data';
import { PaymentMethod } from 'src/orders/entities/payment_method.entity';
import orders from './data/order.data';


@Injectable()
export class SeederService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @InjectRepository(Address) private readonly addressRepository: Repository<Address>,
    @InjectRepository(City) private readonly cityRepository: Repository<City>,
    @InjectRepository(Department) private readonly departmentRepository: Repository<Department>,
    @InjectRepository(PaymentMethod) private readonly paymentRepository: Repository<PaymentMethod>,
    @InjectRepository(Order) private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem) private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(OrderStatus) private readonly orderStatusRepository: Repository<OrderStatus>,
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
    //await this.seedData();
  }

  async seedData() {
    
    try {
    
      await this.reviewRepository.delete({});
      await this.orderRepository.delete({});
      await this.orderStatusRepository.delete({});
      await this.orderItemRepository.delete({});
      await this.paymentRepository.delete({});
      await this.addressRepository.delete({});
      await this.shoppingCartItemRepository.delete({});
      await this.shoppingCartRepository.delete({});
      await this.shoppingCartStatusRepository.delete({});
      await this.userRepository.delete({});
      await this.roleRepository.delete({});
      await this.shoppingCartItemRepository.delete({});
      await this.stockRepository.delete({});
      await this.productRepository.delete({});
      await this.categoryRepository.delete({});
      await this.groupRepository.delete({});
      
     
      await Promise.all(groups.map(async (group) => {
        await this.groupRepository.save(group);
      }));


      await Promise.all(categories.map(async (category) => {
        const {groupId, ...saveCategory} = category;
        const group = await this.groupRepository.findOneBy({id: category.groupId});
        const categoryToSave = {
          ...saveCategory, 
          group
        }
        
        await this.categoryRepository.save(categoryToSave);
      }));


      await Promise.all(departments.map(async (department) => {
        await this.departmentRepository.save(department);
      }));
    
      await Promise.all(cities.map(async (city) => {
        const {deparmentName, ...saveCity} = city;
        const department = await this.departmentRepository.findOneBy({name: deparmentName});
        const cityToSave = {
          ...saveCity, 
          department
        }
        await this.cityRepository.save(cityToSave);
      }));


      await Promise.all(shoppingCartStatus.map(async (status) => {
        await this.shoppingCartStatusRepository.save(status);
      }));


      await Promise.all(roles.map(async (role) => {
        await this.roleRepository.save(role);
      }));

      await Promise.all(users.map(async (user) => {

        const {roleName, ...restUser} = user;
        const role = await this.roleRepository.findOneBy({role: roleName}); 
        const userToSave = {
          ...restUser,
          role
        }
        userToSave.role = role;
        userToSave.password = bcrypt.hashSync(user.password, 10)
        const finalUser = await this.userRepository.save(userToSave);

        const status = await this.shoppingCartStatusRepository.findOneBy({status: "POR PAGAR"}) ;
        const newShoppingCart = new ShoppingCart();
        newShoppingCart.sub_total = 0.0;
        newShoppingCart.status = status;
        newShoppingCart.user = finalUser;

        await this.shoppingCartRepository.save(newShoppingCart);
      }));

      await Promise.all(products.map(async (product) => {
        const {categoryName, ...restProduct} = product;
        const category = await this.categoryRepository.findOneBy({name: categoryName}); 
        const productToSave = {
          ...restProduct,
          category
        }

        const productSaved = await this.productRepository.save(productToSave);
        await this.stockRepository.save({
          stock: 50, 
          unities_sold: 20,
          reserved_stock: 50,
          product: productSaved
        })
      }));

      await Promise.all(reviews.map(async (review) => {
        const {user_email, product_name, ...restReview} = review;
        const user = await this.userRepository.findOneBy({email: user_email});
        const product = await this.productRepository.findOneBy({name: product_name});
        await this.reviewRepository.save({
          ...restReview,
          product,
          user, 
        });
      }));

      await Promise.all(addresses.map(async (address) => {
        const {userEmail, cityName, ...restAddress } = address;
        const user = await this.userRepository.findOneBy({email: userEmail});
        const city = await this.cityRepository.findOneBy({name: cityName});
        await this.addressRepository.save({
          ...restAddress,
          user, 
          city
        })
      }));

      await Promise.all(shopping_cart_items.map(async (shopping_cart_item) => {
        const {userEmail, productName, ...restShoppingCartItem } = shopping_cart_item;
        const user = await this.userRepository.findOneBy({email: userEmail});
        const shoppingCart = await this.shoppingCartRepository.findOneBy({user: user});
        const product = await this.productRepository.findOneBy({name: productName});
        
        await this.shoppingCartItemRepository.save({
          ...restShoppingCartItem,
          price: product.price,
          sub_total: restShoppingCartItem.quantity * product.price,
          product, 
          shoppingCart
        })
      }));

      await Promise.all(orderStatus.map(async (order_status) => {
        await this.orderStatusRepository.save(order_status);
      }));

      await Promise.all(payment_methods.map(async (payment_method) => {
        await this.paymentRepository.save(payment_method);
      }));

      await Promise.all(orders.map(async (order) => {
        const {statusName, userEmail, addressName, paymentMethodName, ...restOrder} = order;
        const status = await this.orderStatusRepository.findOneBy({ name: statusName });
        const address = await this.addressRepository.findOneBy({address: addressName});
        const user = await this.userRepository.findOneBy({email: userEmail});
        const payment_method = await this.paymentRepository.findOneBy({name: paymentMethodName});
        const orderToSave = {
          ...restOrder,
          status, 
          user,
          address,  
          payment_method, 
        }



        const savedOrder = await this.orderRepository.save(orderToSave);

        const product1 = await this.productRepository.findOneBy({name: "Rack de mancuernas"});
        const product2 = await this.productRepository.findOneBy({name: "Mancuernas ajustables"});

        await this.orderItemRepository.save({
          quantity: 3, 
          product: product1, 
          order: savedOrder
        })

        await this.orderItemRepository.save({
          quantity: 1, 
          product: product2, 
          order: savedOrder
        })
        
      }));


    } catch(error) {
      console.log('Error inserting seed data:', error);
    }
  }
}
