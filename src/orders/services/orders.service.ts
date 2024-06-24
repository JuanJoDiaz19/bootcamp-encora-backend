import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order_item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreateOrderItemDto } from '../dto/create-order_item.dto';
import { UpdateOrderItemDto } from '../dto/update-order_item.dto';
import { ProductService } from 'src/product/services/product.service';
import { CreateStatusDto } from '../dto/create-status.dto';
import { Status } from '../entities/status.entity';
import { PaymentMethod } from '../entities/payment_method.entity';
import { UpdateStatusDto } from '../dto/update-status.dto';
import { UpdatePaymentMethodDto } from '../dto/update-payment_method.dto';
import { CreatePaymentMethodDto } from '../dto/create-payment_method.dto';
import { ShoppingCartItem } from 'src/shopping_cart/entities/shopping_cart_item.entity';

@Injectable()
export class OrdersService {

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository : Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemsRepository: Repository<OrderItem>,
    @InjectRepository(Status)
    private readonly statusRepository: Repository<Status>,
    @InjectRepository(PaymentMethod)
    private readonly paymentMethodRepository: Repository<PaymentMethod>,
    private readonly productService : ProductService,
  ){}

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

  async createOrderWithShoppingCartItems(cartItems:ShoppingCartItem[]):Promise<Order>{
    try {

      const orderItems: string[] = await Promise.all(cartItems.map(async cartItem => {
        const { id } = await this.createOrderItem({
          quantity: cartItem.quantity,
          productId: cartItem.product.id
        });
        return id;
      }));

      const order : Order = await this.create({itemsIds:orderItems});

      return order;
      
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

  async createStatus(createStatusDto: CreateStatusDto): Promise<Status> {
    try {
      const name = createStatusDto.name;
      const status = this.statusRepository.findOne({where:{name}})
      if(status){
        throw new Error(`El estado con nombre ${name} ya existe`);
      }

      const newStatus = this.statusRepository.create(createStatusDto);

      return await this.statusRepository.save(newStatus);

    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  
  async getAllStatus(page: string, limit: string): Promise<[Status[], number]> {
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

  async getStatusById(id: string): Promise<Status> {
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

  async updateStatus(id: string, updateStatusDto : UpdateStatusDto): Promise<Status> {
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

  async handleResponse(referenceCode:string, message:string){
    try {
      if (message === 'APPROVED') {
        const order = await this.getPaymentMethodById(referenceCode);
        
        
        if (!order) {
          throw new Error('Order not found');
        }
        //cambiarle el status de la orden a aprovada
        //aqui mandar el correo al usuario de que su orden ha sido enviada
        
      }
      
    } catch (error) {
      throw new NotFoundException("Error en el pago");
    }
  }

}