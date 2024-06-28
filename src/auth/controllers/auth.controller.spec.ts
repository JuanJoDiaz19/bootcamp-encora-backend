import { Test, TestingModule } from '@nestjs/testing';
import { AuthUserController } from './auth-user.controller';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { AdminGuard } from '../guards/admin.guard';
import { Role } from '../entities/role.entity';
import { ShoppingCart } from '../../shopping_cart/entities/shopping_cart.entity';
import { BadRequestException, HttpException, HttpStatus, NotFoundException, UnauthorizedException } from '@nestjs/common';

describe('AuthUserController', () => {
  let controller: AuthUserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthUserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            createUser: jest.fn(),
            login: jest.fn(),
            recoverPassword: jest.fn(),
            findUserById: jest.fn(),
            retriveAllUsers: jest.fn(),
            updateUser: jest.fn(),
            verifyToken: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthUserController>(AuthUserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should call UserService.createUser and return a token and the user', async () => {

      const result = { token: 'some_token', 
      id: '1', 
      email: 'test@example.com', 
      first_name: 'Test', 
      last_name: 'User', 
      password: 'Password123', 
      birth_date: new Date(), 
      reviews: [], 
      role: new Role(), 
      addresses: [], 
      orders: [], 
      shoppingCart: new ShoppingCart() };

      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        password: 'Password123',
        role: 'user',
        birth_date: new Date(),
      };

      jest.spyOn(service, 'createUser').mockResolvedValue(result);
      
      expect(await controller.register(createUserDto)).toEqual(result);
      expect(service.createUser).toHaveBeenCalledWith(createUserDto);
    });

    it('should throw BadRequestException when UserService.createUser fails', async () => {

      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        password: 'Password123',
        role: 'user',
        birth_date: new Date(),
      };

      jest.spyOn(service, 'createUser').mockRejectedValue(new BadRequestException());

      await expect(controller.register(createUserDto)).rejects.toThrow(BadRequestException);
    });

  });

  describe('login', () => {
    it('should call UserService.login and return a token and the user ', async () => {

      const result = { token: 'some_token', 
      user: {
        id: '1',
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        birth_date: new Date(),
        role: 'user',
      }
      };

      const loginUserDto: LoginUserDto = {
        email: 'test@example.com',
        password: 'Password123',
      };

      jest.spyOn(service, 'login').mockResolvedValue(result);

      expect(await controller.login(loginUserDto)).toEqual(result);
      expect(service.login).toHaveBeenCalledWith(loginUserDto);
    });

    it('should throw UnauthorizedException when UserService.login fails', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'test@example.com',
        password: 'Password123',
      };

      jest.spyOn(service, 'login').mockRejectedValue(new UnauthorizedException());

      await expect(controller.login(loginUserDto)).rejects.toThrow(UnauthorizedException);
    });

  });

  describe('recoverPassword', () => {
    it('should call UserService.recoverPassword and return a confirmation', async () => {

      const result= {
        success: true,
        message: 'Password recovery email sent successfully.',
      };
      const email = {email:'test@example.com'};

      jest.spyOn(service, 'recoverPassword').mockResolvedValue(result);

      expect(await controller.recoverPassword(email)).toEqual(result);
      expect(service.recoverPassword).toHaveBeenCalledWith(email.email);
    });

    it('should return an error response when UserService.recoverPassword fails', async () => {
      const email = {email:'test@example.com'};

      jest.spyOn(service, 'recoverPassword').mockRejectedValue(new HttpException(
        {
          success: false,
          message: 'Failed to recover password.',
          error: 'Some error message',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      ));

      const result = await controller.recoverPassword(email);
      expect(result).toEqual({
        success: false,
        message: 'An error occurred while recovering the password.',
        error: 'Failed to recover password.',
      });
      expect(service.recoverPassword).toHaveBeenCalledWith(email.email);
    });

  });

  describe('status', () => {
    it('should call UserService.findUserById and return a user', async () => {

      const result = { 
      id: '1', 
      email: 'test@example.com', 
      first_name: 'Test', 
      last_name: 'User', 
      password: 'Password123', 
      birth_date: new Date(), 
      reviews: [], 
      role: new Role(), 
      addresses: [], 
      orders: [], 
      shoppingCart: new ShoppingCart() };

      const req = { user: { id: '1' } } as any;

      jest.spyOn(service, 'findUserById').mockResolvedValue(result);

      expect(await controller.status(req)).toEqual(result);
      expect(service.findUserById).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when UserService.findUserById fails', async () => {
      const req = { user: { id: '1' } } as any;

      jest.spyOn(service, 'findUserById').mockRejectedValue(new NotFoundException());

      await expect(controller.status(req)).rejects.toThrow(NotFoundException);
    });

  });

  describe('retriveAllUsers', () => {
    it('should call UserService.retriveAllUsers and return a list of users', async () => {

      const result = [{ 
        id: '1', 
        email: 'test@example.com', 
        first_name: 'Test', 
        last_name: 'User', 
        password: 'Password123', 
        birth_date: new Date(), 
        reviews: [], 
        role: new Role(), 
        addresses: [], 
        orders: [], 
        shoppingCart: new ShoppingCart() },
        { 
          id: '2', 
          email: 'test2@example.com', 
          first_name: 'Test2', 
          last_name: 'Use2', 
          password: 'Password123', 
          birth_date: new Date(), 
          reviews: [], 
          role: new Role(), 
          addresses: [], 
          orders: [], 
          shoppingCart: new ShoppingCart() }
      ];

      jest.spyOn(service, 'retriveAllUsers').mockResolvedValue(result);

      expect(await controller.retriveAllUsers()).toEqual(result);
      expect(service.retriveAllUsers).toHaveBeenCalled();
    });

    it('should throw an error when UserService.retriveAllUsers fails', async () => {
      jest.spyOn(service, 'retriveAllUsers').mockRejectedValue(new Error('Error'));

      await expect(controller.retriveAllUsers()).rejects.toThrow(Error);
    });

  });

  describe('updateUser', () => {
    it('should call UserService.updateUser and return the updated user', async () => {

      const user = { 
        id: '1', 
        email: 'test@example.com', 
        first_name: 'Test', 
        last_name: 'User', 
        password: 'Password123', 
        birth_date: new Date(), 
        reviews: [], 
        role: new Role(), 
        addresses: [], 
        orders: [], 
        shoppingCart: new ShoppingCart() };

      const updateUserDto = {
        first_name: 'Updated',
        last_name: 'User',
        email: 'updated@example.com',
        password: 'UpdatedPassword123',
        role: 'admin',
        birth_date: new Date(),
      };

      const updateUser = {
        first_name: 'Updated',
        last_name: 'User',
        email: 'updated@example.com',
        password: 'UpdatedPassword123',
        role: new Role(),
        birth_date: new Date(),
      };

      const id_user = '1';

      jest.spyOn(service, 'findUserById').mockResolvedValue(user);
      jest.spyOn(service, 'updateUser').mockResolvedValue({...user, ...updateUser });

      expect(await controller.updateUser(updateUserDto, id_user)).toEqual({...user, ...updateUser });
      expect(service.updateUser).toHaveBeenCalledWith(updateUserDto, id_user);
    });

    it('should throw NotFoundException when UserService.updateUser fails', async () => {
      const updateUserDto = {
        first_name: 'Updated',
        last_name: 'User',
        email: 'updated@example.com',
        password: 'UpdatedPassword123',
        role: 'admin',
        birth_date: new Date(),
      };

      const id_user = '1';

      jest.spyOn(service, 'updateUser').mockRejectedValue(new NotFoundException());

      await expect(controller.updateUser(updateUserDto, id_user)).rejects.toThrow(NotFoundException);
    });

  });

  describe('searchById', () => {
    it('should call UserService.findUserById and return a user', async () => {

      const result = { 
        id: '1', 
        email: 'test@example.com', 
        first_name: 'Test', 
        last_name: 'User', 
        password: 'Password123', 
        birth_date: new Date(), 
        reviews: [], 
        role: new Role(), 
        addresses: [], 
        orders: [], 
        shoppingCart: new ShoppingCart() };

        const id_user = '1';

        jest.spyOn(service, 'findUserById').mockResolvedValue(result);

        expect(await controller.searchById(id_user)).toEqual(result);
        expect(service.findUserById).toHaveBeenCalledWith(id_user);
    });

    it('should throw NotFoundException when UserService.findUserById fails', async () => {
      const id_user = '1';

      jest.spyOn(service, 'findUserById').mockRejectedValue(new NotFoundException());

      await expect(controller.searchById(id_user)).rejects.toThrow(NotFoundException);
    });

  });

  describe('verifyToken', () => {
    it('should call UserService.verifyToken and return a user', async () => {

      const result = {
        user: {
          id: '1',
          email: 'test@example.com',
          first_name: 'Test',
          last_name: 'User',
          birth_date: new Date(),
          role: 'user',
        },
      };

      const req = { headers: { authorization: 'Bearer token' } } as any;

      jest.spyOn(service, 'verifyToken').mockResolvedValue(result);

      expect(await controller.verifyToken(req)).toEqual(result);
      expect(service.verifyToken).toHaveBeenCalledWith('token');
    });

    it('should throw UnauthorizedException when UserService.verifyToken fails', async () => {
      const req = { headers: { authorization: 'Bearer token' } } as any;

      jest.spyOn(service, 'verifyToken').mockRejectedValue(new UnauthorizedException());

      await expect(controller.verifyToken(req)).rejects.toThrow(UnauthorizedException);
    });

  });
});
