import { Test, TestingModule } from '@nestjs/testing';
import { AddressController } from './address.controller';
import { AddressService } from '../services/address.service';
import { CreateAddressDto } from '../dto/create-address.dto';
import { UpdateAddressDto } from '../dto/update-address.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { City } from '../entities/City.entity';
import { Role } from '../../auth/entities/role.entity';
import { ShoppingCart } from '../../shopping_cart/entities/shopping_cart.entity';
import { User } from '../../auth/entities/user.entity';
import { Address } from '../entities/Address.entity';

describe('AddressController', () => {
  let controller: AddressController;
  let service: AddressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddressController],
      providers: [
        {
          provide: AddressService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AddressController>(AddressController);
    service = module.get<AddressService>(AddressService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new address', async () => {
      const createAddressDto: CreateAddressDto = {
        address: '123 Main St',
        phone_number: '1234567890',
        zip_code: '12345',
        city_name: 'Test City',
      };
      const userId = '1';
      const user: User ={
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
        shoppingCart: new ShoppingCart()
      }
      const result = { 
        id: '1', 
        ...createAddressDto,
        city: new City(),
        user,
        orders:[],
        };

      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.create(createAddressDto, userId)).toEqual(result);
      expect(service.create).toHaveBeenCalledWith(createAddressDto, userId);
    });

    it('should throw BadRequestException when user does not exist', async () => {
      const createAddressDto: CreateAddressDto = {
        address: '123 Main St',
        phone_number: '1234567890',
        zip_code: '12345',
        city_name: 'Test City',
      };
      const userId = '1';

      jest.spyOn(service, 'create').mockRejectedValue(new BadRequestException('User 1 doesnt exist'));

      await expect(controller.create(createAddressDto, userId)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return an array of addresses', async () => {
      const result = [{ id: '1', address: '123 Main St',phone_number: '1234567890', zip_code: '12345', city: new City(), user: new User(), orders:[] },
      { id: '2', address: '123 Main St',phone_number: '1234567890', zip_code: '12345', city: new City(), user: new User(), orders:[] }];

      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return a single address', async () => {
      const result = { id: '1', address: '123 Main St',phone_number: '1234567890', zip_code: '12345', city: new City(), user: new User(), orders:[] };

      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      expect(await controller.findOne('1')).toEqual(result);
    });

    it('should throw NotFoundException when address is not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException('Address not found'));

      await expect(controller.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an address', async () => {
      const address = { id: '1', address: '123 Main St',phone_number: '1234567890', zip_code: '12345', city: new City(), user: new User(), orders:[] }
      const updateAddressDto: UpdateAddressDto = { address: '456 Main St' };

      jest.spyOn(service, 'update').mockResolvedValue({...address,...updateAddressDto});

      expect(await controller.update('1', updateAddressDto)).toEqual({...address,...updateAddressDto});
      expect(service.update).toHaveBeenCalledWith('1', updateAddressDto);
    });

    it('should throw NotFoundException when address is not found', async () => {
      const updateAddressDto: UpdateAddressDto = { address: '456 Main St' };

      jest.spyOn(service, 'update').mockRejectedValue(new NotFoundException('Address with id: 1 not found'));

      await expect(controller.update('1', updateAddressDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove an address', async () => {
      const result = { raw: { affectedRows: 1 } };

      jest.spyOn(service, 'remove').mockResolvedValue(result);

      expect(await controller.remove('1')).toEqual(result);
      expect(service.remove).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when address is not found', async () => {
      jest.spyOn(service, 'remove').mockRejectedValue(new NotFoundException('Address not found'));

      await expect(controller.remove('1')).rejects.toThrow(NotFoundException);
    });
  });
});
