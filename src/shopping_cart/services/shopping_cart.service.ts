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
import { ShoppingCartResponseDto } from '../dto/response-shopping_cart.dto';

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
      relations: ['items', 'items.product'],
    });

    if (!shoppingCart) {
      throw new NotFoundException('Shopping Cart not found');
    }

    return shoppingCart;
  }

  async update(
    shoppingCartId: string,
    updateShoppingCartDto: UpdateShoppingCartDto,
): Promise<ShoppingCartResponseDto> {
    const { productIds, operation } = updateShoppingCartDto;

    // Obtener el carrito de compras
    const shoppingCart = await this.shoppingCartRepository.findOne({
        where: { id: shoppingCartId },
        relations: ['items', 'items.product'],
    });

    if (!shoppingCart) {
        throw new NotFoundException(`Shopping cart with ID: ${shoppingCartId} not found`);
    }

    // Obtener los productos por IDs
    const products = await this.productService.getProductsByIds(productIds);

    if (!products || products.length !== productIds.length) {
        throw new NotFoundException('One or more products not found');
    }
    console.log("ca", shoppingCart.user)
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
                newItem.shoppingCart = shoppingCart; // Asigna el carrito de compras al nuevo item
                shoppingCart.items.push(newItem);
            }
        }
    } else if (operation === 'remove') {
        const itemsToRemove = shoppingCart.items.filter((item) =>
            productIds.includes(item.product.id),
        );

        if (itemsToRemove.length === 0) {
            throw new NotFoundException('No items to remove found in the cart');
        }

        shoppingCart.items = shoppingCart.items.filter(
            (item) => !productIds.includes(item.product.id),
        );
        await this.shoppingCartItemRepository.remove(itemsToRemove);
    } else {
        throw new Error('Invalid operation');
    }

    // Calcular el subtotal
    shoppingCart.sub_total = shoppingCart.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
    );
    

    const result = await this.shoppingCartRepository.save(shoppingCart);


    // Mapea el carrito de compras a DTO para la respuesta
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
      userId: result.user ? result.user.id : null, // Verifica si result.user está definido
  };


    return responseDto;
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
  
  async buy(shoppingCartId: string): Promise<String>{
    const shoppingCart = await this.shoppingCartRepository.findOne({
      where: { id: shoppingCartId },
      relations: ['items', 'items.product'],
    });
    const order = await this.orderService.createOrderWithShoppingCartItems(shoppingCart.items);
    return this.paymentService.generatePaymentLink(shoppingCart.sub_total,order.id,shoppingCart.user.email)
  }
}
