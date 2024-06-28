import { Test, TestingModule } from '@nestjs/testing';
import { ShoppingCartService } from './shopping_cart.service';
import { ShoppingCart } from '../entities/shopping_cart.entity';
import { ShoppingCartItem } from '../entities/shopping_cart_item.entity';
import { ProductService } from '../../product/services/product.service';
import { PaymentService } from './payment.service';
import { OrdersService } from '../../orders/services/orders.service';
import { AddressService } from '../../common/services/address.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { Stock } from '../../product/entities/stock.entity';
import { Role } from '../../auth/entities/role.entity';
import { ShoppingCartStatus } from '../entities/shopping_cart_status.entity';
import { ShoppingCartResponseDto } from '../dto/response-shopping_cart.dto';
import { UpdateShoppingCartDto } from '../dto/update-shopping_cart.dto';
import { Category } from '../../product/entities/category.entity';

describe('ShoppingCartService', () => {
  let service: ShoppingCartService;
  let shoppingCartRepository: MockType<Repository<ShoppingCart>>;
  let shoppingCartItemRepository: MockType<Repository<ShoppingCartItem>>;
  let productService: MockType<ProductService>;
  let addressService: MockType<AddressService>;
  let paymentService: MockType<PaymentService>;
  let orderService: MockType<OrdersService>;
  let dataSource: MockType<DataSource>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShoppingCartService,
        {
          provide: getRepositoryToken(ShoppingCart),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(ShoppingCartItem),
          useValue: mockRepository(),
        },
        {
          provide: ProductService,
          useValue: mockProductService(),
        },
        {
          provide: AddressService,
          useValue: mockAddressService(),
        },
        {
          provide: PaymentService,
          useValue: mockPaymentService(),
        },
        {
          provide: OrdersService,
          useValue: mockOrderService(),
        },
        {
          provide: DataSource,
          useValue: mockDataSource(),
        },
      ],
    }).compile();

    service = module.get<ShoppingCartService>(ShoppingCartService);
    shoppingCartRepository = module.get(getRepositoryToken(ShoppingCart));
    shoppingCartItemRepository = module.get(getRepositoryToken(ShoppingCartItem));
    productService = module.get(ProductService);
    addressService = module.get(AddressService);
    paymentService = module.get(PaymentService);
    orderService = module.get(OrdersService);
    dataSource = module.get(DataSource);
  });

  function mockRepository() {
    return {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };
  }

  function mockProductService() {
    return {
      getProductsByIds: jest.fn(),
    };
  }

  function mockAddressService() {
    return {
      findOne: jest.fn(),
    };
  }

  function mockPaymentService() {
    return {
      generatePaymentLink: jest.fn(),
    };
  }

  function mockOrderService() {
    return {
      createOrderWithShoppingCartItems: jest.fn(),
    };
  }

  function mockDataSource() {
    return {
      createQueryRunner: jest.fn().mockReturnValue({
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
          findOne: jest.fn(),
          save: jest.fn(),
          remove: jest.fn(),
        },
      }),
      transaction: jest.fn(),
    };
  }

  type MockType<T> = {
    [P in keyof T]: jest.Mock<{}>;
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of shopping carts', async () => {
      const result: ShoppingCart[] = [
        {
          id: '1',
          user: {
            id: '1',
            email: '',
            first_name: '',
            last_name: '',
            password: '',
            birth_date: undefined,
            reviews: [],
            role: new Role,
            addresses: [],
            orders: [],
            shoppingCart: new ShoppingCart
          },
          items: [],
          sub_total: 0,
          status: new ShoppingCartStatus
        },
      ];
      shoppingCartRepository.find = jest.fn().mockResolvedValue(result);

      expect(await service.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single shopping cart', async () => {
      const result: ShoppingCart = {
        id: '1',
        user: {
          id: '1',
          email: '',
          first_name: '',
          last_name: '',
          password: '',
          birth_date: undefined,
          reviews: [],
          role: new Role,
          addresses: [],
          orders: [],
          shoppingCart: new ShoppingCart
        },
        items: [],
        sub_total: 0,
        status: new ShoppingCartStatus
      };
      shoppingCartRepository.findOne = jest.fn().mockResolvedValue(result);

      expect(await service.findOne('1')).toBe(result);
    });

    it('should throw NotFoundException when cart is not found', async () => {
      shoppingCartRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOneByUser', () => {
    it('should return a shopping cart for a specific user', async () => {
      const result: ShoppingCart = {
        id: '1',
        user: {
          id: '1',
          email: '',
          first_name: '',
          last_name: '',
          password: '',
          birth_date: undefined,
          reviews: [],
          role: new Role,
          addresses: [],
          orders: [],
          shoppingCart: new ShoppingCart
        },
        items: [],
        sub_total: 0,
        status: new ShoppingCartStatus
      };
      shoppingCartRepository.findOne = jest.fn().mockResolvedValue(result);

      expect(await service.findOneByUser('1')).toBe(result);
    });

    it('should throw NotFoundException when cart is not found', async () => {
      shoppingCartRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.findOneByUser('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a shopping cart', async () => {
      const result: ShoppingCartResponseDto = {
        id: '1',
        items: [{
          id: undefined,
          price: 100,
          productId: "1",
          quantity: 1,
          sub_total: 100,
          }],
        sub_total: 100,
        status: new ShoppingCartStatus,
        userId: '1',
      };
      const updateDto: UpdateShoppingCartDto = {
        productIds: ['1'],
        operation: 'add',
      };
      const shoppingCart: ShoppingCart = {
        id: '1',
        user: {
          id: '1',
          email: '',
          first_name: '',
          last_name: '',
          password: '',
          birth_date: undefined,
          reviews: [],
          role: new Role,
          addresses: [],
          orders: [],
          shoppingCart: new ShoppingCart
        },
        items: [],
        sub_total: 0,
        status: new ShoppingCartStatus
      };
      const product = { id: '1', price: 100 } as any;

      jest.spyOn(service, 'findOneByUser').mockResolvedValue(shoppingCart);
      productService.getProductsByIds = jest.fn().mockResolvedValue([product]);
      jest.spyOn(dataSource, 'transaction').mockImplementation(async (callback) => {
        return callback({
          findOne: jest.fn().mockResolvedValue({ ...product, stock: 10 }),
          save: jest.fn().mockResolvedValue(shoppingCart),
        });
      });

      expect(await service.update('1', updateDto)).toStrictEqual(result);
    });

    it('should throw NotFoundException when cart is not found', async () => {
      const updateDto: UpdateShoppingCartDto = {
        productIds: ['1'],
        operation: 'add',
      };
      jest.spyOn(service, 'findOneByUser').mockResolvedValue(null);

      await expect(service.update('1', updateDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeProductFromCart', () => {
    it('should remove an item from the shopping cart', async () => {
      const result: ShoppingCartResponseDto = {
        id: '1',
        items: [],
        sub_total: 0,
        status: new ShoppingCartStatus,
        userId: '1',
      };
      const shoppingCart: ShoppingCart = {
        id: '1',
        user: {
          id: '1',
          email: '',
          first_name: '',
          last_name: '',
          password: '',
          birth_date: undefined,
          reviews: [],
          role: new Role,
          addresses: [],
          orders: [],
          shoppingCart: new ShoppingCart
        },
        items: [{
          id: '1', product: {
            id: '1',
            name: '',
            type: '',
            creation_date: undefined,
            description: '',
            price: 0,
            rating: 0,
            image_urls: [],
            category: new Category,
            status: '',
            stock: new Stock,
            reviews: [],
            order_items: [],
            shopping_cart_items: []
          }, quantity: 1, price: 100, sub_total: 100,
          shoppingCart: new ShoppingCart
        }],
        sub_total: 100,
        status: new ShoppingCartStatus
      };

      jest.spyOn(service, 'findOneByUser').mockResolvedValue(shoppingCart);
      shoppingCartItemRepository.remove = jest.fn().mockResolvedValue(shoppingCart.items[0]);
      shoppingCartRepository.save = jest.fn().mockResolvedValue(shoppingCart);

      expect(await service.removeProductFromCart('1', '1')).toStrictEqual(result);
    });

    it('should throw NotFoundException when item is not found', async () => {
      const shoppingCart: ShoppingCart = {
        id: '1',
        user: {
          id: '1',
          email: '',
          first_name: '',
          last_name: '',
          password: '',
          birth_date: undefined,
          reviews: [],
          role: new Role,
          addresses: [],
          orders: [],
          shoppingCart: new ShoppingCart
        },
        items: [],
        sub_total: 0,
        status: new ShoppingCartStatus
      };

      jest.spyOn(service, 'findOneByUser').mockResolvedValue(shoppingCart);

      await expect(service.removeProductFromCart('1', '1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove the shopping cart', async () => {
      const shoppingCart: ShoppingCart = {
        id: '1',
        user: {
          id: '1',
          email: '',
          first_name: '',
          last_name: '',
          password: '',
          birth_date: undefined,
          reviews: [],
          role: new Role,
          addresses: [],
          orders: [],
          shoppingCart: new ShoppingCart
        },
        items: [],
        sub_total: 0,
        status: new ShoppingCartStatus
      };

      jest.spyOn(service, 'findOneByUser').mockResolvedValue(shoppingCart);
      shoppingCartItemRepository.remove = jest.fn().mockResolvedValue(shoppingCart.items);
      shoppingCartRepository.save = jest.fn().mockResolvedValue(shoppingCart);

      await service.remove('1');

      expect(shoppingCartItemRepository.remove).toHaveBeenCalledWith(shoppingCart.items);
      expect(shoppingCartRepository.save).toHaveBeenCalledWith(shoppingCart);
    });

    it('should throw NotFoundException when cart is not found', async () => {
      jest.spyOn(service, 'findOneByUser').mockResolvedValue(null);

      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('buy', () => {
    it('should generate a payment link', async () => {
      const shoppingCart: ShoppingCart = {
        id: '1',
        user: {
          id: '1', email: 'test@example.com',
          first_name: '',
          last_name: '',
          password: '',
          birth_date: undefined,
          reviews: [],
          role: new Role,
          addresses: [],
          orders: [],
          shoppingCart: new ShoppingCart
        },
        items: [{
          id: '1', product: {
            id: '1',
            name: '',
            type: '',
            creation_date: undefined,
            description: '',
            price: 0,
            rating: 0,
            image_urls: [],
            category: new Category,
            status: '',
            stock: new Stock,
            reviews: [],
            order_items: [],
            shopping_cart_items: []
          }, quantity: 1, price: 100, sub_total: 100,
          shoppingCart: new ShoppingCart
        }],
        sub_total: 100,
        status: new ShoppingCartStatus
      };
      const address = { id: '1', address: '123 Street', city: { name: 'City' } };
      const order = { id: '1' };

      jest.spyOn(service, 'findOneByUser').mockResolvedValue(shoppingCart);
      jest.spyOn(service, 'reserveStockForPurchase').mockResolvedValue(undefined);
      addressService.findOne = jest.fn().mockResolvedValue(address);
      orderService.createOrderWithShoppingCartItems = jest.fn().mockResolvedValue(order);
      paymentService.generatePaymentLink = jest.fn().mockResolvedValue('http://payment.link');

      expect(await service.buy('1', '1')).toBe('http://payment.link');
    });

    it('should throw NotFoundException when cart is not found', async () => {
      jest.spyOn(service, 'findOneByUser').mockResolvedValue(null);

      await expect(service.buy('1', '1')).rejects.toThrow(NotFoundException);
    });
  });
});
