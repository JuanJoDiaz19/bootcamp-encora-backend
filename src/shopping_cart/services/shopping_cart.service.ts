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

    const shoppingCart = await this.findOneByUser(userId)

    if (!shoppingCart) {
        throw new NotFoundException(`Shopping cart with user ID: ${userId} not found`);
    }

    const products = await this.productService.getProductsByIds(productIds);

    if (!products || products.length !== productIds.length) {
        throw new NotFoundException('One or more products not found');
    }
    if (operation === 'add') {
        for (const product of products) {
            if (!product || !product.id) {
                throw new Error('Invalid product data');
            }

            const existingItem = shoppingCart.items.find(
                (item) => item.product.id === product.id,
            );

            if (existingItem) {
                existingItem.quantity += 1;
                existingItem.sub_total = product.price * existingItem.quantity;
            } else {
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
              await this.shoppingCartItemRepository.remove(existingItem);
          }
      }
  } else {
      throw new Error('Invalid operation');
  }

    shoppingCart.sub_total = shoppingCart.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
    );
    

    const result = await this.shoppingCartRepository.save(shoppingCart);


    const responseDto: ShoppingCartResponseDto = {
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

    await this.dataSource.transaction(async manager => {
      for (const item of shoppingCart.items) {
        const stock = await manager.findOne(Stock, {
          where: { product: { id: item.product.id } },
          lock: { mode: 'pessimistic_write' }
        });

        if (!stock) {
          throw new NotFoundException(`Stock for product ${item.product.id} not found`);
        }

        if (stock.reserved_stock == stock.stock) {
          throw new ConflictException('No hay unidades reservadas disponibles. Vuelve en 15 minutos.');
        }

        if (stock.stock < item.quantity) {
          if (stock.stock - stock.reserved_stock >= item.quantity) {
            item.quantity = stock.stock - stock.reserved_stock;
          } else {
            if (stock.stock > stock.reserved_stock) {
              item.quantity = stock.stock - stock.reserved_stock;
            } else {
              await manager.remove(ShoppingCartItem, item);
              shoppingCart.items = shoppingCart.items.filter(i => i.id !== item.id);
            }
          }
          await manager.save(ShoppingCartItem, item);
        }
      }

      shoppingCart.sub_total = shoppingCart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      await manager.save(ShoppingCart, shoppingCart);
    });
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
    console.log(shoppingCart)
    const order = await this.orderService.createOrderWithShoppingCartItems(shoppingCart.user, address,shoppingCart.items);
    console.log("popo", order)
    return this.paymentService.generatePaymentLink(shoppingCart.sub_total, order.id, shoppingCart.user.email,address.address, address.city.name);
}

}
