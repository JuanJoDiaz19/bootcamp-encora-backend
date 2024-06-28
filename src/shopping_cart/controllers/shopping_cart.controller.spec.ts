import { Test, TestingModule } from '@nestjs/testing';
import { ShoppingCartController } from './shopping_cart.controller';
import { ShoppingCartService } from '../services/shopping_cart.service';
import { CreateShoppingCartDto } from '../dto/create-shopping_cart.dto';
import { UpdateShoppingCartDto } from '../dto/update-shopping_cart.dto';
import { ShoppingCart } from '../entities/shopping_cart.entity';
import { ShoppingCartResponseDto } from '../dto/response-shopping_cart.dto';
import { Role } from '../../auth/entities/role.entity';
import { ShoppingCartStatus } from '../entities/shopping_cart_status.entity';

describe('ShoppingCartController', () => {
  let controller: ShoppingCartController;
  let service: ShoppingCartService;

  const mockShoppingCartService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    findOneByUser: jest.fn(),
    buy: jest.fn(),
    update: jest.fn(),
    removeProductFromCart: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShoppingCartController],
      providers: [
        {
          provide: ShoppingCartService,
          useValue: mockShoppingCartService,
        },
      ],
    }).compile();

    controller = module.get<ShoppingCartController>(ShoppingCartController);
    service = module.get<ShoppingCartService>(ShoppingCartService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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
          status: new ShoppingCartStatus,
        },
      ];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
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
      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      expect(await controller.findOne('1')).toBe(result);
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
      jest.spyOn(service, 'findOneByUser').mockResolvedValue(result);

      expect(await controller.findOneByUser('1')).toBe(result);
    });
  });

  describe('buy', () => {
    it('should generate a payment link', async () => {
      const result = 'http://payment.link';
      jest.spyOn(service, 'buy').mockResolvedValue(result);

      expect(await controller.buy('1', '1')).toBe(result);
    });
  });

  describe('update', () => {
    it('should update a shopping cart', async () => {
      const result: ShoppingCartResponseDto = {
        id: '1',
        items: [],
        sub_total: 0,
        status: new ShoppingCartStatus,
        userId: '1',
      };
      const updateDto: UpdateShoppingCartDto = {
        productIds: ['1'],
        operation: 'add',
      };
      jest.spyOn(service, 'update').mockResolvedValue(result);

      expect(await controller.update('1', updateDto)).toBe(result);
    });
  });

  describe('removeItem', () => {
    it('should remove an item from the shopping cart', async () => {
      const result: ShoppingCartResponseDto = {
        id: '1',
        items: [],
        sub_total: 0,
        status: new ShoppingCartStatus,
        userId: '1',
      };
      jest.spyOn(service, 'removeProductFromCart').mockResolvedValue(result);

      expect(await controller.removeItem('1', '1')).toBe(result);
    });
  });

  describe('remove', () => {
    it('should remove the shopping cart', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      expect(await controller.remove('1')).toBeUndefined();
    });
  });
});
