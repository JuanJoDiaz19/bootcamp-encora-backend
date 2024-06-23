import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateShoppingCartDto } from '../dto/create-shopping_cart.dto';
import { UpdateShoppingCartDto } from '../dto/update-shopping_cart.dto';
import { ShoppingCart } from '../entities/shopping_cart.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ShoppingCartItem } from '../entities/shopping_cart_item.entity';
import { ProductService } from 'src/product/services/product.service';
import { PaymentService } from './payment.service';
import { OrdersService } from 'src/orders/services/orders.service';

@Injectable()
export class ShoppingCartService {
  
  constructor(@InjectRepository(ShoppingCart)
  private readonly shoppingCartRepository: Repository<ShoppingCart>,
  @InjectRepository(ShoppingCartItem)
  private readonly shoppingCartItemRepository: Repository<ShoppingCartItem>,
  private readonly productService: ProductService,
  private readonly paymentService: PaymentService,
  private readonly orderService: OrdersService,
  ){}
  
  
  async createShoppingCart(): Promise<ShoppingCart> {
    const shoppingCart = this.shoppingCartRepository.create();
    shoppingCart.sub_total=0;
    //const shoppingCart = this.shoppingCartRepository.create({ user: { id: userId } });
    return await this.shoppingCartRepository.save(shoppingCart);
  }

  async findAll(): Promise<ShoppingCart[]> {
    return this.shoppingCartRepository.find();
  }


  async findOne(id: string): Promise<ShoppingCart> {
    const shoppingCart = await this.shoppingCartRepository.findOne({
      where: { id },
      relations: ['items', 'items.product'],
    });

    if (!shoppingCart) {
      throw new NotFoundException('Shopping Cart not found');
    }

    return shoppingCart;
  } 
  
  
  async update(shoppingCartId: string, updateShoppingCartDto: UpdateShoppingCartDto): Promise<ShoppingCart> {
    const { productIds, operation } = updateShoppingCartDto;

    const shoppingCart = await this.shoppingCartRepository.findOne({
      where: { id: shoppingCartId },
      relations: ['items', 'items.product'],
    });

    if (!shoppingCart) {
      throw new NotFoundException(`Shopping cart with ID: ${shoppingCartId} not found`);
    }

    const products = await this.productService.getProductsByIds(productIds);

    console.log(products, "cacac")

    if (products.length !== productIds.length) {
      throw new NotFoundException('One or more products not found');
    }

    if (operation === 'add') {
      for (const product of products) {
        const existingItem = shoppingCart.items.find(item => item.product.id === product.id);
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          const newItem = new ShoppingCartItem();
          newItem.shopping_cart = shoppingCart;
          newItem.product = product;
          newItem.quantity = 1; 
          newItem.price = product.price;
          await this.shoppingCartItemRepository.save(newItem);
          shoppingCart.items.push(newItem);
        }
      }
    } else if (operation === 'remove') {
      const itemsToRemove = shoppingCart.items.filter(item => productIds.includes(item.product.id));
      shoppingCart.items = shoppingCart.items.filter(item => !productIds.includes(item.product.id));
      await this.shoppingCartItemRepository.remove(itemsToRemove);
    } else {
      throw new Error('Invalid operation');
    }

    shoppingCart.sub_total = shoppingCart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return this.shoppingCartRepository.save(shoppingCart);
}


  async remove(id: string): Promise<void> {
    try {
      const shoppingCart = await this.shoppingCartRepository.findOne({
        where: { id: id },
        relations: ['items', 'items.product'],
      });

      if (!shoppingCart) {
        throw new NotFoundException('Shopping Cart not found');
      }

      await this.shoppingCartItemRepository.remove(shoppingCart.items);

      shoppingCart.items = [];

      shoppingCart.sub_total = 0;

      await this.shoppingCartRepository.save(shoppingCart);
    } catch (error) {
      throw new InternalServerErrorException('Error emptying shopping cart');
    }
  }
  
  async buy(shoppingCartId: string){
    const shoppingCart = await this.shoppingCartRepository.findOne({
      where: { id: shoppingCartId },
      relations: ['items', 'items.product'],
    });
    const order = await this.orderService.createOrderWithShoppingCartItems(shoppingCart.items);
    const response = this.paymentService.generatePaymentLink(shoppingCart.sub_total,order.id,shoppingCart.user.email)
  }
}

