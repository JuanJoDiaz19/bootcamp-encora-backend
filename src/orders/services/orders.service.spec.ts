import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order_item.entity';
import { OrderStatus } from '../entities/order-status.entity';
import { PaymentMethod } from '../entities/payment_method.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, DeleteResult, Repository } from 'typeorm';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ProductService } from '../../product/services/product.service';
import { CreateResponseDto } from '../entities/create-response.dto';
import { MailerService } from '@nestjs-modules/mailer';

describe('OrdersService', () => {
  let service: OrdersService;
  let orderRepository: MockType<Repository<Order>>;
  let orderItemsRepository: MockType<Repository<OrderItem>>;
  let statusRepository: MockType<Repository<OrderStatus>>;
  let paymentMethodRepository: MockType<Repository<PaymentMethod>>;
  let productService: MockType<ProductService>;
  let mailerService: MockType<MailerService>;
  let dataSource : MockType<DataSource>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getRepositoryToken(Order),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(OrderItem),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(OrderStatus),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(PaymentMethod),
          useValue: mockRepository(),
        },
        {
          provide: ProductService,
          useValue: mockProductService(),
        },
        {
          provide: MailerService,
          useValue: mockMailerService(),
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    orderRepository = module.get(getRepositoryToken(Order));
    orderItemsRepository = module.get(getRepositoryToken(OrderItem));
    statusRepository = module.get(getRepositoryToken(OrderStatus));
    paymentMethodRepository = module.get(getRepositoryToken(PaymentMethod));
    productService = module.get(ProductService);
    mailerService = module.get(MailerService);
  });

  function mockRepository() {
    return {
      create:jest.fn(),
      findOne: jest.fn(),
      findOneBy: jest.fn(),
      save: jest.fn(),
      preload: jest.fn(),
      find: jest.fn(),
      findAndCount: jest.fn(),
      delete: jest.fn(),
    };
  }

  function mockProductService() {
    return {
      getProductById: jest.fn(),
    };
  }

  function mockMailerService() {
    return {
      sendMail: jest.fn(),
    };
  }

  const mockDataSource = {
    transaction : jest.fn().mockReturnThis(),
  };
  

  type MockType<T> = {
    [P in keyof T]: jest.Mock<{}>;
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(orderRepository).toBeDefined();
    expect(orderItemsRepository).toBeDefined();
    expect(statusRepository).toBeDefined();
    expect(paymentMethodRepository).toBeDefined();
    expect(productService).toBeDefined();
    expect(mailerService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new order', async () => {
      const createOrderDto: CreateOrderDto = { itemsIds: ['1', '2'] };
      const items: OrderItem[] = [
        { id: '1', quantity: 1, product: { price: 100 }, order: null },
        { id: '2', quantity: 2, product: { price: 200 }, order: null },
      ] as any;
      const total_price = 500;
      const newOrder = { id: '1', total_price, items } as Order;

      jest.spyOn(service, 'getOrderItemsByArrayIds').mockResolvedValue(items);
      jest.spyOn(service, 'calculateTotalPrice').mockReturnValue(total_price);
      orderRepository.save = jest.fn().mockResolvedValue(newOrder);

      expect(await service.create(createOrderDto)).toEqual(newOrder);
      expect(service.getOrderItemsByArrayIds).toHaveBeenCalledWith(createOrderDto.itemsIds);
      expect(service.calculateTotalPrice).toHaveBeenCalledWith(items);
    });

    it('should throw BadRequestException on invalid data', async () => {
      const createOrderDto: CreateOrderDto = { itemsIds: ['1', '2'] };

      jest.spyOn(service, 'getOrderItemsByArrayIds').mockRejectedValue(new Error('Invalid data'));

      await expect(service.create(createOrderDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getAllOrders', () => {
    it('should return an array of orders and count', async () => {
      const result: [Order[], number] = [[new Order()], 1];

      orderRepository.findAndCount = jest.fn().mockResolvedValue(result);

      expect(await service.getAllOrders('1', '10')).toEqual(result);
    });

    it('should throw BadRequestException on invalid pagination data', async () => {
      await expect(service.getAllOrders('invalid', '10')).rejects.toThrow(BadRequestException);
    });
  });

  describe('getOrderById', () => {
    it('should return a single order', async () => {
      const result = new Order();

      orderRepository.findOne = jest.fn().mockResolvedValue(result);

      expect(await service.getOrderById('1')).toEqual(result);
    });

    it('should throw NotFoundException when order is not found', async () => {
      orderRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.getOrderById('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateOrder', () => {
    it('should update an order', async () => {
      const updateOrderDto: UpdateOrderDto = {
        itemsIds: ['1', '2'],
        shipment_date: undefined,
        received_date: undefined
      };
      const order = new Order();
      const items: OrderItem[] = [
        { id: '1', quantity: 1, product: { price: 100 }, order: null },
        { id: '2', quantity: 2, product: { price: 200 }, order: null },
      ] as any;

      jest.spyOn(service, 'getOrderById').mockResolvedValue(order);
      jest.spyOn(service, 'getOrderItemsByArrayIds').mockResolvedValue(items);
      orderRepository.save = jest.fn().mockResolvedValue(order);

      expect(await service.updateOrder('1', updateOrderDto)).toEqual(order);
      expect(service.getOrderById).toHaveBeenCalledWith('1');
      expect(service.getOrderItemsByArrayIds).toHaveBeenCalledWith(updateOrderDto.itemsIds);
      expect(orderRepository.save).toHaveBeenCalledWith({ ...order, items });
    });

    it('should throw NotFoundException when order is not found', async () => {
      const updateOrderDto: UpdateOrderDto = {
        itemsIds: ['1', '2'],
        shipment_date: undefined,
        received_date: undefined
      };

      jest.spyOn(service, 'getOrderById').mockRejectedValue(new NotFoundException('Order not found'));

      await expect(service.updateOrder('1', updateOrderDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteOrder', () => {
    it('should remove an order', async () => {
      const result = { affected: 1 } as DeleteResult;
      const order = new Order();

      jest.spyOn(service, 'getOrderById').mockResolvedValue(order);
      orderRepository.delete = jest.fn().mockResolvedValue(result);

      expect(await service.deleteOrder('1')).toEqual(result);
      expect(orderRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when order is not found', async () => {
      jest.spyOn(service, 'getOrderById').mockRejectedValue(new NotFoundException('Order not found'));

      await expect(service.deleteOrder('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('handleResponse', () => {

    it('should throw NotFoundException when order is not found', async () => {
      const createResponseDto: CreateResponseDto = {
        message: 'APPROVED', referenceCode: '1',
        lapPaymentMethod: '',
        lapPaymentMethodType: '',
        processingDate: undefined
      };

      jest.spyOn(service, 'getOrderById').mockRejectedValue(new NotFoundException('Order not found'));

      await expect(service.handleResponse(createResponseDto)).rejects.toThrow(NotFoundException);
    });
  });
});
