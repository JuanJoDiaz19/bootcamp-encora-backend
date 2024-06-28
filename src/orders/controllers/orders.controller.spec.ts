import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from '../services/orders.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { Order } from '../entities/order.entity';
import { DeleteResult } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateResponseDto } from '../entities/create-response.dto';

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: mockService(),
        },
      ],
    }).compile();
    controller = module.get<OrdersController>(OrdersController);
    service = module.get<OrdersService>(OrdersService);
  });

  function mockService() {
    return {
      create: jest.fn(),
      getAllOrders: jest.fn(),
      getOrderById: jest.fn(),
      updateOrder: jest.fn(),
      deleteOrder: jest.fn(),
      handleResponse: jest.fn(),
    };
  }

  type MockType<T> = {
    [P in keyof T]: jest.Mock<{}>;
  };

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new order', async () => {
      const createOrderDto: CreateOrderDto = {
        itemsIds: ['1', '2'],
      };
      const result = new Order();
      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.create(createOrderDto)).toEqual(result);
      expect(service.create).toHaveBeenCalledWith(createOrderDto);
    });

    it('should throw BadRequestException on invalid data', async () => {
      const createOrderDto: CreateOrderDto = {
        itemsIds: ['1', '2'],
      };
      jest.spyOn(service, 'create').mockRejectedValue(new BadRequestException('Invalid data'));

      await expect(controller.create(createOrderDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return an array of orders and count', async () => {
      const result: [Order[], number] = [[new Order()], 1];
      jest.spyOn(service, 'getAllOrders').mockResolvedValue(result);

      expect(await controller.findAll('1', '10')).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return a single order', async () => {
      const result = new Order();
      jest.spyOn(service, 'getOrderById').mockResolvedValue(result);

      expect(await controller.findOne('1')).toEqual(result);
    });

    it('should throw NotFoundException when order is not found', async () => {
      jest.spyOn(service, 'getOrderById').mockRejectedValue(new NotFoundException('Order not found'));

      await expect(controller.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an order', async () => {
      const updateOrderDto: UpdateOrderDto = {
        itemsIds: ['1', '2'],
        shipment_date: undefined,
        received_date: undefined
      };
      const result = new Order();
      jest.spyOn(service, 'updateOrder').mockResolvedValue(result);

      expect(await controller.update('1', updateOrderDto)).toEqual(result);
      expect(service.updateOrder).toHaveBeenCalledWith('1', updateOrderDto);
    });

    it('should throw NotFoundException when order is not found', async () => {
      const updateOrderDto: UpdateOrderDto = {
        itemsIds: ['1', '2'],
        shipment_date: undefined,
        received_date: undefined
      };
      jest.spyOn(service, 'updateOrder').mockRejectedValue(new NotFoundException('Order not found'));

      await expect(controller.update('1', updateOrderDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove an order', async () => {
      const result = { affected: 1 } as DeleteResult;
      jest.spyOn(service, 'deleteOrder').mockResolvedValue(result);

      expect(await controller.remove('1')).toEqual(result);
      expect(service.deleteOrder).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when order is not found', async () => {
      jest.spyOn(service, 'deleteOrder').mockRejectedValue(new NotFoundException('Order not found'));

      await expect(controller.remove('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('handleResponse', () => {
    it('should handle PayU response', async () => {
      const createResponseDto: CreateResponseDto = {
        message: 'APPROVED',
        referenceCode: '1',
        lapPaymentMethod: '',
        lapPaymentMethodType: '',
        processingDate: undefined
      };
      const result = { message: 'Orden procesada' };
      jest.spyOn(service, 'handleResponse').mockResolvedValue(result);

      expect(await controller.handleResponse(createResponseDto)).toEqual(result);
      expect(service.handleResponse).toHaveBeenCalledWith(createResponseDto);
    });
  });

  describe('handleConfirmation', () => {
    it('should handle PayU confirmation', async () => {
      const createResponseDto: CreateResponseDto = {
        message: 'APPROVED',
        referenceCode: '1',
        lapPaymentMethod: '',
        lapPaymentMethodType: '',
        processingDate: undefined
      };
      const result = { message: 'Order confirmed' };
      jest.spyOn(service, 'handleResponse').mockResolvedValue(result);

      expect(await controller.handleConfirmation(createResponseDto)).toEqual(result);
      expect(service.handleResponse).toHaveBeenCalledWith(createResponseDto);
    });
  });
});
