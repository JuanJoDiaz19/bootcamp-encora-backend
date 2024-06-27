import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateShoppingCartDto } from '../dto/create-shopping_cart.dto';
import { UpdateShoppingCartDto } from '../dto/update-shopping_cart.dto';
import { ShoppingCart } from '../entities/shopping_cart.entity';
import {  DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ShoppingCartItem } from '../entities/shopping_cart_item.entity';
import { ProductService } from '../../product/services/product.service';
import { PaymentService } from './payment.service';
import { OrdersService } from '../../orders/services/orders.service';
import { ShoppingCartResponseDto } from '../dto/response-shopping_cart.dto';
import { AddressService } from '../../common/services/address.service';
import { Stock } from 'src/product/entities/stock.entity';

@Injectable()
export class ShoppingCartService {
  
  constructor(@InjectRepository(ShoppingCart)
  private readonly shoppingCartRepository: Repository<ShoppingCart>,
  @InjectRepository(ShoppingCartItem)
  private readonly shoppingCartItemRepository: Repository<ShoppingCartItem>,
  private readonly productService: ProductService,
  private readonly addressService: AddressService,
  private readonly paymentService: PaymentService,
  private readonly orderService: OrdersService,
  private readonly dataSource: DataSource,
  ){}
  
  
  async createShoppingCart(userId: string): Promise<ShoppingCart> {
    const shoppingCart = this.shoppingCartRepository.create({ user: { id: userId } });
    shoppingCart.sub_total = 0;
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

  async findOneByUser(userId: string): Promise<ShoppingCart> {
    const shoppingCart = await this.shoppingCartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['items', 'items.product', 'user'],
    });

    if (!shoppingCart) {
      throw new NotFoundException('Shopping Cart not found');
    }

    return shoppingCart;
  }

  async update(
    userId: string,
    updateShoppingCartDto: UpdateShoppingCartDto,
  ): Promise<ShoppingCartResponseDto> {
    const { productIds, operation } = updateShoppingCartDto;
  
    const shoppingCart = await this.findOneByUser(userId);
  
    if (!shoppingCart) {
      throw new NotFoundException(`Shopping cart with user ID: ${userId} not found`);
    }
  
    const products = await this.productService.getProductsByIds(productIds);
  
    if (!products || products.length !== productIds.length) {
      throw new NotFoundException('One or more products not found');
    }
  
    const responseDto = await this.dataSource.transaction(async manager => {
      if (operation === 'add') {
        for (const product of products) {
          if (!product || !product.id) {
            throw new Error('Invalid product data');
          }
  
          const stock = await manager.findOne(Stock, {
            where: { product: { id: product.id } },
            lock: { mode: 'pessimistic_write' }
          });
  
          if (!stock) {
            throw new NotFoundException(`Stock for product ${product.id} not found`);
          }
  
          const availableStock = stock.stock - stock.reserved_stock;
          

          if (availableStock <= 0) {
              await this.refreshShoppingCart(userId)
            throw new ConflictException(`Insufficient stock for product ${product.name}`);
          }
  
          const existingItem = shoppingCart.items.find(
            (item) => item.product.id === product.id,
          );
  
          if (existingItem) {
            const newQuantity = existingItem.quantity + 1;
            if (newQuantity > availableStock) {
              await this.refreshShoppingCart(userId)
              throw new ConflictException(`Insufficient stock for product ${product.name}`);
            }
            existingItem.quantity = newQuantity;
            existingItem.sub_total = product.price * existingItem.quantity;
          } else {
            if (availableStock < 1) {
              throw new ConflictException(`Insufficient stock for product ${product.name}`);
            }
            const newItem = new ShoppingCartItem();
            newItem.sub_total = product.price;
            newItem.product = product;
            newItem.quantity = 1;
            newItem.price = product.price;
            newItem.shoppingCart = shoppingCart;
            shoppingCart.items.push(newItem);
          }
        }
      } else if (operation === 'remove') {
        for (const productId of productIds) {
          const existingItem = shoppingCart.items.find(
            (item) => item.product.id === productId,
          );
  
          if (!existingItem) {
            throw new NotFoundException(`Item with product ID: ${productId} not found in the cart`);
          }
  
          existingItem.quantity -= 1;
          existingItem.sub_total = existingItem.price * existingItem.quantity;
  
          if (existingItem.quantity <= 0) {
            shoppingCart.items = shoppingCart.items.filter(
              (item) => item.product.id !== productId,
            );
            await manager.remove(ShoppingCartItem, existingItem);
          } else {
            await manager.save(ShoppingCartItem, existingItem);
          }
        }
      } else {
        throw new Error('Invalid operation');
      }
  
      shoppingCart.sub_total = shoppingCart.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
  
      const result = await manager.save(ShoppingCart, shoppingCart);
  
      return {
        id: result.id,
        items: result.items.map(item => {
          if (!item.product) {
            throw new Error('Product not found in item');
          }
          return {
            id: item.id,
            productId: item.product.id,
            quantity: item.quantity,
            price: item.price,
            sub_total: item.sub_total
          };
        }),
        sub_total: result.sub_total,
        status: result.status,
        userId: result.user ? result.user.id : null,
      };
    });
  
    return responseDto;
  }
  
  


async removeProductFromCart(userId: string, productId: string): Promise<ShoppingCartResponseDto> {
  const shoppingCart = await this.findOneByUser(userId);

  if (!shoppingCart) {
    throw new NotFoundException(`Shopping cart with user ID: ${userId} not found`);
  }

  const existingItem = shoppingCart.items.find(
    (item) => item.product.id === productId,
  );

  if (!existingItem) {
    throw new NotFoundException(`Item with product ID: ${productId} not found in the cart`);
  }

  shoppingCart.items = shoppingCart.items.filter(
    (item) => item.product.id !== productId,
  );
  await this.shoppingCartItemRepository.remove(existingItem);

  shoppingCart.sub_total = shoppingCart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const result = await this.shoppingCartRepository.save(shoppingCart);

  const responseDto: ShoppingCartResponseDto = {
    id: result.id,
    items: result.items.map(item => ({
      id: item.id,
      productId: item.product.id,
      quantity: item.quantity,
      price: item.price,
      sub_total: item.sub_total
    })),
    sub_total: result.sub_total,
    status: result.status,
    userId: result.user ? result.user.id : null,
  };

  return responseDto;
}



  async remove(userId: string): Promise<void> {
    try {
      const shoppingCart = await this.findOneByUser(userId)

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

  
  async refreshShoppingCart(userId: string): Promise<void> {
    
    const shoppingCart = await this.shoppingCartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['items', 'items.product', 'items.product.stock'],
    });
  
    if (!shoppingCart) {
      throw new NotFoundException(`Shopping cart for user ${userId} not found`);
    }
  
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
  
    try {
      for (const item of shoppingCart.items) {
        
        const stock = await queryRunner.manager.findOne(Stock, {
          where: { product: { id: item.product.id } }
        });
  
  
        if (!stock) {
          throw new NotFoundException(`Stock for product ${item.product.id} not found`);
        }
  
        const availableStock = stock.stock - stock.reserved_stock;
  
        if (availableStock <= 0) {
          // No hay stock disponible, eliminar el item
          await queryRunner.manager.remove(ShoppingCartItem, item);
          shoppingCart.items = shoppingCart.items.filter(i => i.id !== item.id);
          continue;
        }
  
        if (item.quantity > availableStock) {
          item.quantity = availableStock;
        }
  
        await queryRunner.manager.save(ShoppingCartItem, item);
      }
  
      shoppingCart.sub_total = shoppingCart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      await queryRunner.manager.save(ShoppingCart, shoppingCart);
  
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error(`Error refreshing shopping cart: ${error.message}`);
      throw error;
    } finally {
      await queryRunner.release();
      console.log(`Finished refreshing shopping cart for user ${userId}`);
    }
  }
  
  
  
  async reserveStockForPurchase(userId: string): Promise<void> {
    const shoppingCart = await this.shoppingCartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['items', 'items.product', 'items.product.stock'],
    });
  
    if (!shoppingCart) {
      throw new NotFoundException(`Shopping cart for user ${userId} not found`);
    }
  
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
  
    try {
      for (const item of shoppingCart.items) {
  
        const stock = await queryRunner.manager.findOne(Stock, {
          where: { product: { id: item.product.id } },
          lock: { mode: 'pessimistic_write' }
        });
  
  
        if (!stock) {
          throw new NotFoundException(`Stock for product ${item.product.id} not found`);
        }
  
        const availableStock = stock.stock - stock.reserved_stock;
  
        if (item.quantity > availableStock) {
          throw new ConflictException(`Not enough stock available for product ${item.product.name}. Available: ${availableStock}, Requested: ${item.quantity}`);
        }
  
        if (stock.reserved_stock + item.quantity > stock.stock) {
          throw new ConflictException(`Not enough reserved stock available for product ${item.product.name}.`);
        }
  
        stock.reserved_stock += item.quantity;
        await queryRunner.manager.save(Stock, stock);
      }
  
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error(`Error reserving stock for purchase: ${error.message}`);
      throw error;
    } finally {
      await queryRunner.release();
      console.log(`Finished reserving stock for user ${userId}`);
    }
  }
  
  
  async buy(userId: string, addressId: string): Promise<string> {
    const shoppingCart = await this.findOneByUser(userId)

    if (!shoppingCart) {
        throw new NotFoundException(`Shopping cart with user ID: ${userId} not found`);
    }

    if (shoppingCart.items.length === 0) {
        throw new BadRequestException(`Shopping cart with ID: ${shoppingCart.id} is empty`);
    }


    const address = await this.addressService.findOne(addressId)

    if (!address) {
      throw new NotFoundException(`Addres with id ${addressId} not found `);
  }
    await this.reserveStockForPurchase(userId);
    const order = await this.orderService.createOrderWithShoppingCartItems(shoppingCart.user, address,shoppingCart.items);
    
    return this.paymentService.generatePaymentLink(shoppingCart.sub_total, order.id, shoppingCart.user.email,address.address, address.city.name);
}

}
