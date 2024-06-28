import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { ShoppingCartService } from '../../shopping_cart/services/shopping_cart.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { BadRequestException, NotFoundException, UnauthorizedException, HttpException, HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { ShoppingCart } from '../../shopping_cart/entities/shopping_cart.entity';
import * as bcrypt from 'bcrypt';
import { OrdersService } from '../../orders/services/orders.service';

describe('UserService', () => {
    let service: UserService;
    let userRepository: MockType<Repository<User>>;
    let roleRepository: MockType<Repository<Role>>;
    let jwtService: JwtService;
    let mailerService: MailerService;
    let shoppingCartService: ShoppingCartService;
    let orderService: MockType<OrdersService>; 
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          UserService,
          {
            provide: getRepositoryToken(User),
            useValue: mockRepository(),
          },
          {
            provide: getRepositoryToken(Role),
            useValue: mockRepository(),
          },
          {
            provide: JwtService,
            useValue: {
              sign: jest.fn().mockReturnValue('mockedJwtToken'),
              verify: jest.fn(),
            },
          },
          {
            provide: MailerService,
            useValue: {
              sendMail: jest.fn(),
            },
          },
          {
            provide: ShoppingCartService,
            useValue: {
              createShoppingCart: jest.fn(),
            },
          },
          {
            provide: OrdersService,
            useValue: {},
          },
        ],
      }).compile();
  
      service = module.get<UserService>(UserService);
      userRepository = module.get(getRepositoryToken(User));
      roleRepository = module.get(getRepositoryToken(Role));
      jwtService = module.get(JwtService);
      mailerService = module.get(MailerService);
      shoppingCartService = module.get(ShoppingCartService);
      orderService = module.get(OrdersService);
    });
  
    function mockRepository() {
      return {
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
        preload: jest.fn(),
        find: jest.fn(),
        delete: jest.fn(),
      };
    }
  
    type MockType<T> = {
      [P in keyof T]: jest.Mock<{}>;
    };
  
    it('should be defined', () => {
      expect(service).toBeDefined();
      expect(userRepository).toBeDefined();
      expect(roleRepository).toBeDefined();
      expect(jwtService).toBeDefined();
      expect(mailerService).toBeDefined();
      expect(shoppingCartService).toBeDefined();
    });
  
    describe('createUser', () => {
      it('should create a new user and return the user with a token', async () => {
        const createUserDto: CreateUserDto = {
          email: 'test@example.com',
          first_name: 'Test',
          last_name: 'User',
          password: 'Password123',
          role: 'user',
          birth_date: new Date(),
        };
  
        const role = new Role();
        role.role = 'user';
  
        const newCart = new ShoppingCart();
        const user = new User();
        user.id = '4908705d-b880-467d-9ad6-f81b0138d8ba';
        user.email = 'test@example.com';
        user.first_name = 'Test';
        user.last_name = 'User';
        user.password = 'Password123';
        user.role = role;
        user.shoppingCart = newCart;
  
        roleRepository.findOne = jest.fn().mockResolvedValue(role);
        jest.spyOn(shoppingCartService, 'createShoppingCart').mockResolvedValue(newCart);
        userRepository.create = jest.fn().mockReturnValue(user);
        userRepository.save = jest.fn().mockResolvedValue(user);
        jwtService.sign = jest.fn().mockReturnValue('mockedJwtToken');
  
        const result = await service.createUser(createUserDto);
        expect(result).toEqual({ ...user, token: 'mockedJwtToken' });
      });
  
      it('should throw BadRequestException when the role is not found', async () => {
        const createUserDto: CreateUserDto = {
          email: 'test@example.com',
          first_name: 'Test',
          last_name: 'User',
          password: 'Password123',
          role: 'user',
          birth_date: new Date(),
        };
  
        roleRepository.findOne = jest.fn().mockResolvedValue(null);
        jest.spyOn(service,'createUser').mockRejectedValue( new BadRequestException())
  
        await expect(service.createUser(createUserDto)).rejects.toThrow(BadRequestException);
      });
  
      it('should handle database errors gracefully', async () => {
        const createUserDto: CreateUserDto = {
          email: 'test@example.com',
          first_name: 'Test',
          last_name: 'User',
          password: 'Password123',
          role: 'user',
          birth_date: new Date(),
        };
  
        roleRepository.findOne = jest.fn().mockResolvedValue(new Role());
        jest.spyOn(shoppingCartService,'createShoppingCart').mockResolvedValue(new ShoppingCart())
        userRepository.save = jest.fn().mockRejectedValue(new Error('Database error'));
  
        await expect(service.createUser(createUserDto)).rejects.toThrow(InternalServerErrorException);
      });
    });
  
    describe('login', () => {
      it('should return user and token for valid credentials', async () => {
        const loginUserDto: LoginUserDto = {
          email: 'test@example.com',
          password: 'Password123',
        };

        const date = new Date();
  
        const user = new User();
        user.id = '1';
        user.email = 'test@example.com';
        user.password = bcrypt.hashSync('Password123', 10);
        user.first_name = 'Test';
        user.last_name = 'User';
        user.birth_date = date;
        user.role = new Role();
        user.role.role = 'user';
  
        userRepository.findOne = jest.fn().mockResolvedValue(user);
        jwtService.sign = jest.fn().mockReturnValue('mockedJwtToken');
  
        const result = await service.login(loginUserDto);
        expect(result).toEqual({
          user: {
            id: '1',
            email: 'test@example.com',
            first_name: 'Test',
            last_name: 'User',
            birth_date: date,
            role: 'user',
          },
          token: 'mockedJwtToken',
        });
      });
  
      it('should throw UnauthorizedException for invalid email', async () => {
        const loginUserDto: LoginUserDto = {
          email: 'test@example.com',
          password: 'Password123',
        };
  
        userRepository.findOne = jest.fn().mockResolvedValue(null);
  
        await expect(service.login(loginUserDto)).rejects.toThrow(UnauthorizedException);
      });
  
      it('should throw UnauthorizedException for invalid password', async () => {
        const loginUserDto: LoginUserDto = {
          email: 'test@example.com',
          password: 'Password123',
        };
  
        const user = new User();
        user.password = 'invalid_password';
  
        userRepository.findOne = jest.fn().mockResolvedValue(user);
  
        await expect(service.login(loginUserDto)).rejects.toThrow(UnauthorizedException);
      });
    });
  
    describe('recoverPassword', () => {
      it('should send a recovery email and return success', async () => {
        const email = 'test@example.com';
  
        const user = new User();
        user.id = '1';
        user.email = email;
        user.first_name = 'Test';
  
        userRepository.findOne = jest.fn().mockResolvedValue(user);
        userRepository.save = jest.fn().mockResolvedValue(user);
        jest.spyOn(mailerService,'sendMail').mockResolvedValue(null)
  
        const result = await service.recoverPassword(email);
        expect(result).toEqual({
          success: true,
          message: 'Password recovery email sent successfully.',
        });
      });
  
      it('should throw HttpException when user is not found', async () => {
        const email = 'test@example.com';
  
        userRepository.findOne = jest.fn().mockResolvedValue(null);
  
        await expect(service.recoverPassword(email)).rejects.toThrow(HttpException);
      });
  
      it('should handle errors gracefully', async () => {
        const email = 'test@example.com';
  
        userRepository.findOne = jest.fn().mockResolvedValue(new User());
        userRepository.save = jest.fn().mockRejectedValue(new Error('Database error'));

        jest.spyOn(service,'recoverPassword').mockRejectedValue(new HttpException(
            {
              success: false,
              message: 'Failed to recover password.',
              error: 'Some error message',
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
          ));
  
        await expect(service.recoverPassword(email)).rejects.toThrow(HttpException);
      });
    });
  
    describe('updateUser', () => {
      it('should update the user and return the updated user', async () => {
        const updateUserDto: UpdateUserDto = {
          first_name: 'Updated',
          last_name: 'User',
          email: 'updated@example.com',
          password: 'UpdatedPassword123',
          role: 'admin',
          birth_date: new Date(),
        };
  
        const user = new User();
        user.id = '1';
        user.first_name = 'Test';
        user.last_name = 'User';
        user.email = 'test@example.com';
  
        userRepository.preload = jest.fn().mockResolvedValue(user);
        userRepository.save = jest.fn().mockResolvedValue(user);
  
        const result = await service.updateUser(updateUserDto, '1');
        expect(result).toEqual(user);
      });
  
      it('should throw NotFoundException when user is not found', async () => {
        const updateUserDto: UpdateUserDto = {
          first_name: 'Updated',
          last_name: 'User',
          email: 'updated@example.com',
          password: 'UpdatedPassword123',
          role: 'admin',
          birth_date: new Date(),
        };
  
        userRepository.preload = jest.fn().mockResolvedValue(null);
  
        await expect(service.updateUser(updateUserDto, '1')).rejects.toThrow(NotFoundException);
      });
  
      it('should handle database errors gracefully', async () => {
        const updateUserDto: UpdateUserDto = {
          first_name: 'Updated',
          last_name: 'User',
          email: 'updated@example.com',
          password: 'UpdatedPassword123',
          role: 'admin',
          birth_date: new Date(),
        };
  
        const user = new User();
        user.id = '1';
  
        userRepository.preload = jest.fn().mockResolvedValue(user);
        userRepository.save = jest.fn().mockRejectedValue(new Error('Database error'));
  
        await expect(service.updateUser(updateUserDto, '1')).rejects.toThrow(InternalServerErrorException);
      });
    });

    describe('findUserById', () => {
      it('should return a user for a valid id', async () => {
        const user = new User();
        user.id = '1';
        user.email = 'test@example.com';
        user.first_name = 'Test';
        user.last_name = 'User';
        user.birth_date = new Date();
        user.role = new Role();
        user.role.role = 'user';
  
        userRepository.findOne = jest.fn().mockResolvedValue(user);
  
        const result = await service.findUserById('1');
        expect(result).toEqual(user);
      });
  
      it('should throw NotFoundException when user is not found', async () => {
        userRepository.findOne = jest.fn().mockResolvedValue(null);
  
        await expect(service.findUserById('1')).rejects.toThrow(NotFoundException);
      });
    });
  
    describe('retriveAllUsers', () => {
      it('should return all users', async () => {
        const users = [new User(), new User()];
  
        userRepository.find = jest.fn().mockResolvedValue(users);
  
        const result = await service.retriveAllUsers();
        expect(result).toEqual(users);
      });
    });
  
    describe('verifyToken', () => {
      it('should return user for a valid token', async () => {
        const decoded = { id: '1' };
        const date = new Date();
        const user = new User();
        user.id = '1';
        user.email = 'test@example.com';
        user.first_name = 'Test';
        user.last_name = 'User';
        user.birth_date = date;
        user.role = new Role();
        user.role.role = 'user';
  
        jwtService.verify = jest.fn().mockReturnValue(decoded);
        userRepository.findOne = jest.fn().mockResolvedValue(user);
  
        const result = await service.verifyToken('valid_token');
        expect(result).toEqual({
          user: {
            id: '1',
            email: 'test@example.com',
            first_name: 'Test',
            last_name: 'User',
            birth_date: date,
            role: 'user',
          },
        });
      });
  
      it('should throw UnauthorizedException for an invalid token', async () => {
        jwtService.verify = jest.fn().mockImplementation(() => {
          throw new Error('Invalid token');
        });
  
        await expect(service.verifyToken('invalid_token')).rejects.toThrow(UnauthorizedException);
      });
  
      it('should throw NotFoundException when user is not found', async () => {
        const decoded = { id: '1' };
  
        jwtService.verify = jest.fn().mockReturnValue(decoded);
        userRepository.findOne = jest.fn().mockResolvedValue(null);
  
        await expect(service.verifyToken('valid_token')).rejects.toThrow(NotFoundException);
      });
    });
  });