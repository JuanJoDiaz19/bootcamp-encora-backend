import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order_item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeleteResult, Repository } from 'typeorm';
import { CreateOrderItemDto } from '../dto/create-order_item.dto';
import { UpdateOrderItemDto } from '../dto/update-order_item.dto';
import { ProductService } from '../../product/services/product.service';
import { CreateStatusDto } from '../dto/create-status.dto';
import { OrderStatus } from '../entities/order-status.entity';
import { PaymentMethod } from '../entities/payment_method.entity';
import { UpdateStatusDto } from '../dto/update-status.dto';
import { UpdatePaymentMethodDto } from '../dto/update-payment_method.dto';
import { CreatePaymentMethodDto } from '../dto/create-payment_method.dto';
import { ShoppingCartItem } from '../../shopping_cart/entities/shopping_cart_item.entity';
import { User } from '../../auth/entities/user.entity';
import { Address } from '../../common/entities/Address.entity';
import { CreateResponseDto } from '../dto/create-response.dto';
import { MailerService } from '@nestjs-modules/mailer';
import generateEmail from './data/order-email-template.data';
import { Stock } from '../../product/entities/stock.entity';
import * as cron from 'node-cron';

@Injectable()
export class OrdersService {

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository : Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemsRepository: Repository<OrderItem>,
    @InjectRepository(OrderStatus)
    private readonly statusRepository: Repository<OrderStatus>,
    @InjectRepository(PaymentMethod)
    private readonly paymentMethodRepository: Repository<PaymentMethod>,
    private readonly mailerService: MailerService,
    private readonly productService : ProductService,
    private readonly dataSource: DataSource,
  ){
    cron.schedule('* * * * *', () => this.checkWaitingOrders()); 
  }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    try {
      let itemsIds = createOrderDto.itemsIds;

      const items: OrderItem[] = await this.getOrderItemsByArrayIds(itemsIds);

      const total_price: number = this.calculateTotalPrice(items);

      const newOrder = this.orderRepository.create({
        total_price,
        items,
      });
      return await this.orderRepository.save(newOrder);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  calculateTotalPrice(items: OrderItem[]): number{
    return items.reduce((total, item) => total + (item.quantity * item.product.price), 0);
  }

  async getAllOrders(page: string, limit: string): Promise<[Order[], number]> {
    try {
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);

      if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber <= 0 || limitNumber <= 0) {
        throw new Error('La pagina y el limite deben ser numeros positivos');
      }
      return await this.orderRepository.findAndCount({
        skip: (pageNumber - 1) * limitNumber,
        take: limitNumber,
        relations: {
          items:true,
        },
      })
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getOrderById(id: string): Promise<Order> {
    try {
      const order = await this.orderRepository.findOne({
        where:{id},
        relations:{
          items:true,
        }
      });
      if(!order){
        throw new Error(`La orden con id ${id} no existe`);
      }
      return order;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async updateOrder(id: string, updateOrderDto: UpdateOrderDto) {
    try {
      const order: Order = await this.getOrderById(id);

      if(!order){
        throw new Error(`La orden con id ${id} no existe`);
      }

      const itemsIds = updateOrderDto.itemsIds;
      let updateOrder:Order;
      if(itemsIds){
        const items: OrderItem[] = await this.getOrderItemsByArrayIds(itemsIds); 
        updateOrder = Object.assign(order,{
          ...updateOrderDto,
          items:items,
        });
      }else{
        updateOrder = Object.assign(order,updateOrderDto);
      }      
      return this.orderRepository.save(updateOrder);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async deleteOrder(id: string): Promise<DeleteResult> {
    try {
      const order : Order = await this.getOrderById(id);

      return this.orderRepository.delete(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async createOrderWithShoppingCartItems(user:User, address:Address,cartItems: ShoppingCartItem[]): Promise<Order> {
    try {
        const order = this.orderRepository.create({
            total_price: 0
        });
        const savedOrder = await this.orderRepository.save(order);

        const orderItems = await Promise.all(cartItems.map(async cartItem => {
            const orderItem = this.orderItemsRepository.create({
                quantity: cartItem.quantity,
                product: cartItem.product,
                order: savedOrder,  
            });
            return this.orderItemsRepository.save(orderItem);
        }));

        const totalPrice = orderItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
        const name = "WAITING"
        const waiting = await this.statusRepository.findOne({ where: { name } });
        savedOrder.items = orderItems;
        savedOrder.total_price = totalPrice;
        savedOrder.status= waiting;
        savedOrder.user=user;
        savedOrder.address=address;

        await this.orderRepository.save(savedOrder);

        
        return savedOrder;
    } catch (error) {
        throw new BadRequestException(error.message);
    }
}

  //CRUD ORDER ITEMS
  
  async createOrderItem(createOrderItemDto: CreateOrderItemDto): Promise<OrderItem> {
    try {
      const id = createOrderItemDto.productId;
      const product = await this.productService.getProductById(id);
      if(!product){
        throw new Error(`El producto con id ${id} no es posible asignarlo a un item de orden, ya que no existe`)
      }

      const newOrderItem = this.orderItemsRepository.create({
        ...createOrderItemDto,
        product,
      })

      return await this.orderItemsRepository.save(newOrderItem);

    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAllOrderItems(page: string, limit: string): Promise<[OrderItem[], number]> {
    try {
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);

      if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber <= 0 || limitNumber <= 0) {
        throw new Error('La pagina y el limite deben ser numeros positivos');
      }
      return await this.orderItemsRepository.findAndCount({
        skip: (pageNumber - 1) * limitNumber,
        take: limitNumber,
        relations: {
          order:true,
        },
      })
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getOrderItemById(id: string): Promise<OrderItem> {
    try {
      const item: OrderItem = await this.orderItemsRepository.findOne({where:{id}});

      if(!item){
        throw  new Error(`El order item con id ${id} no existe`)
      }

      return item;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async updateOrderItem(id: string, updateOrderItemDto: UpdateOrderItemDto): Promise<OrderItem> {
    try {
      const orderItem = await this.getOrderItemById(id);
      if (!orderItem) {
        throw new Error(`El item de orden con id ${id} no existe`);
      }
      const productId = updateOrderItemDto.productId;
      let updateOrderItem:OrderItem;
      if (productId) {
        const product = await this.productService.getProductById(id);
        if(!product){
          throw new Error(`El producto con id ${id} no es posible asignarlo a un item de orden, ya que no existe`)
        }
        updateOrderItem = Object.assign(orderItem,{
          ...updateOrderItemDto,
          product,
        })
      }else{
        updateOrderItem = Object.assign(orderItem,updateOrderItemDto)
      }
      return await this.orderItemsRepository.save(updateOrderItem)
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async deleteOrderItem(id: string): Promise<DeleteResult> {
    try {
      const orderItem = await this.getOrderItemById(id);
      return await this.orderItemsRepository.delete(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async getOrderItemsByArrayIds(itemsIds:string[]): Promise<OrderItem[]>{
    return Promise.all(itemsIds.map(async item => await this.getOrderItemById(item)));
  }

  //CRUD STATUS

  async createStatus(createStatusDto: CreateStatusDto): Promise<OrderStatus> {
    try {
        const name = createStatusDto.name;

        const existingStatus = await this.statusRepository.findOne({ where: { name } });

        if (existingStatus) {
            throw new Error(`El estado con nombre ${name} ya existe`);
        }

        const newStatus = this.statusRepository.create(createStatusDto);

        return await this.statusRepository.save(newStatus);

    } catch (error) {
        throw new BadRequestException(error.message);
    }
}

  
  async getAllStatus(page: string, limit: string): Promise<[OrderStatus[], number]> {
    try {
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);
  
      if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber <= 0 || limitNumber <= 0) {
        throw new Error('La pagina y el limite deben ser numeros positivos');
      }
      return await this.statusRepository.findAndCount({
        skip: (pageNumber - 1) * limitNumber,
        take: limitNumber,
        relations: {
          orders:true,
        },
      })
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getStatusById(id: string): Promise<OrderStatus> {
    try {
      const status = await this.statusRepository.findOne({where:{id}});

      if(!status){
        throw new Error(`El estado con id ${id} no existe`);
      }

      return status;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async getStatusByName(name: string): Promise<OrderStatus> {
    try {
      const status = await this.statusRepository.findOne({ where: { name } });

      if(!status){
        throw new Error(`El estado con nombre ${name} no existe`);
      }

      return status;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }


  async updateStatus(id: string, updateStatusDto : UpdateStatusDto): Promise<OrderStatus> {
    try {
      const status = this.getStatusById(id);
      const updateStatus = Object.assign(status,updateStatusDto);
      return await this.statusRepository.save(updateStatus);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async deleteStatus(id: string): Promise<DeleteResult> {
    try {
      const status = this.getStatusById(id);
      return await this.statusRepository.delete(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  //CRUD PAYMENT METHOD

  async createPaymentMethod(createPaymentMethodDto: CreatePaymentMethodDto): Promise<PaymentMethod> {
    try {
      const name = createPaymentMethodDto.name;
      const method = this.paymentMethodRepository.findOne({where:{name}})
      if(method){
        throw new Error(`El metodo de pago con nombre ${name} ya existe`);
      }

      const newPaymentMethod = this.paymentMethodRepository.create(createPaymentMethodDto);

      return await this.paymentMethodRepository.save(newPaymentMethod);

    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAllPaymentMethods(page: string, limit: string): Promise<[PaymentMethod[], number]> {
    try {
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);
  
      if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber <= 0 || limitNumber <= 0) {
        throw new Error('La pagina y el limite deben ser numeros positivos');
      }
      return await this.paymentMethodRepository.findAndCount({
        skip: (pageNumber - 1) * limitNumber,
        take: limitNumber,
        relations: {
          orders:true,
        },
      })
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getPaymentMethodById(id: string): Promise<PaymentMethod> {
    try {
      const method = await this.paymentMethodRepository.findOne({where:{id}});

      if(!method){
        throw new Error(`El metodo de pago con id ${id} no existe`);
      }

      return method;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async updatePaymentMethod(id: string, updatePaymentMethodDto: UpdatePaymentMethodDto): Promise<PaymentMethod> {
    try {
      const method = this.getPaymentMethodById(id);
      const updatePaymentMethod = Object.assign(method,updatePaymentMethodDto);
      return await this.paymentMethodRepository.save(updatePaymentMethod);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async deletePaymentMethod(id: string): Promise<DeleteResult> {
    try {
      const status = this.getPaymentMethodById(id);
      return await this.paymentMethodRepository.delete(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async approveOrder(orderId: string): Promise<void> {
    const order = await this.orderRepository.findOne({
      where: {id: orderId},
      relations:  [
        'user', 
        'items.product', 
        'status', 
        'address', 
        'payment_method']
    });
    
    
    if (!order) {
      throw new Error('Order not found');
    }

    await this.dataSource.transaction(async manager => {
      
      for (const item of order.items) {
        const stock = await manager.findOne(Stock, {
          where: { product: { id: item.product.id } },
          lock: { mode: 'pessimistic_write' }
        });

        if (!stock) {
          throw new NotFoundException(`Stock for product ${item.product.id} not found`);
        }

        

        if (stock.stock < item.quantity) {
          throw new ConflictException(`Not enough stock for product ${item.product.id}`);
        }

        stock.stock -= item.quantity;
        stock.unities_sold += item.quantity;
        stock.reserved_stock -= item.quantity;

        await manager.save(Stock, stock);
      }
    });
  }

  async releaseStockForDeniedOrder(orderId: string): Promise<void> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: [
        'user',
        'items.product',
        'status',
        'address',
        'payment_method',
      ],
    });
  
    if (!order) {
      throw new NotFoundException('Order not found');
    }
  
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
  
    try {
      for (const item of order.items) {
  
        const stock = await queryRunner.manager.findOne(Stock, {
          where: { product: { id: item.product.id } },
          lock: { mode: 'pessimistic_write' },
        });
  
  
        if (!stock) {
          throw new NotFoundException(`Stock for product ${item.product.id} not found`);
        }
  
        stock.reserved_stock -= item.quantity;
  
        await queryRunner.manager.save(Stock, stock);
      }
  
      const deniedStatus = await this.getStatusByName('DENIED');
      order.status = deniedStatus;
      await queryRunner.manager.save(order);
  
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error(`Error releasing stock for denied order: ${error.message}`);
      throw error;
    } finally {
      await queryRunner.release();
      console.log(`Finished releasing stock for denied order ${orderId}`);
    }
  }
  
  async handleResponse(data:CreateResponseDto){
    try {
        
      if (data.message === 'APPROVED') {
        const order = await this.orderRepository.findOne({
          where: {id: data.referenceCode},
          relations:  [
            'user', 
            'items.product', 
            'status', 
            'address', 
            'payment_method']
        });
        
        
        if (!order) {
          throw new Error('Order not found');
        }

        await this.approveOrder(data.referenceCode);

        const name = "APPROVED"
        const approved =  await this.getStatusByName(name);
        
        const today = new Date();

        order.status = approved
        order.shipment_date=today
        order.received_date=today
        
        

        //aqui mandar el correo al usuario de que su orden ha sido enviada
        const htmlContent = generateEmail(order);
        
        this.mailerService.sendMail({
          to: order.user.email,
          from: 'fitnestcorp@gmail.com',
          subject: '🛒 Confirmación de Compra 🏋️‍♀️ FitNest',
          text: htmlContent,
          html: htmlContent,
        });
        
        return { message: 'Orden procesada' };
      }else{

        const order = await this.orderRepository.findOne({
          where: {id: data.referenceCode},
          relations:  [
            'user', 
            'items.product', 
            'status', 
            'address', 
            'payment_method']
        });
        
        
        if (!order) {
          throw new Error('Order not found');
        }

        await this.releaseStockForDeniedOrder(data.referenceCode)

        const name = "DENIED"
        const denied =  await this.getStatusByName(name);
        
        order.status = denied

      }
      
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }


  async checkWaitingOrders(): Promise<void> {
    const name = "WAITING"
    const waiting =  await this.getStatusByName(name);

    const waitingOrders = await this.orderRepository.find({
      where: { status: waiting },
    });

    const now = new Date();

    for (const order of waitingOrders) {
      const orderDate = new Date(order.creation_date);
      const diffMinutes = (now.getTime() - orderDate.getTime()) / (1000 * 60);

      if (diffMinutes > 20) {
        Logger.log(`Order ${order.id} has been waiting for more than 20 minutes. Updating to denied.`);
        await this.releaseStockForDeniedOrder(order.id);
      }
    }
  }

}