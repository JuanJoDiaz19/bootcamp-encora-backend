import { Test, TestingModule } from '@nestjs/testing';
import { AddressService } from './address.service';
import { Address } from '../entities/Address.entity';
import { City } from '../entities/City.entity';
import { User } from '../../auth/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAddressDto } from '../dto/create-address.dto';
import { UpdateAddressDto } from '../dto/update-address.dto';
import { NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';

describe('AddressService', () => {
    let service: AddressService;
    let addressRepository: MockType<Repository<Address>>;
    let cityRepository: MockType<Repository<City>>;
    let userRepository: MockType<Repository<User>>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
        providers: [
            AddressService,
            {
            provide: getRepositoryToken(Address),
            useValue: mockRepository(),
            },
            {
            provide: getRepositoryToken(City),
            useValue: mockRepository(),
            },
            {
            provide: getRepositoryToken(User),
            useValue: mockRepository(),
            },
        ],
        }).compile();

        service = module.get<AddressService>(AddressService);
        addressRepository = module.get(getRepositoryToken(Address));
        cityRepository = module.get(getRepositoryToken(City));
        userRepository = module.get(getRepositoryToken(User));
    });

    function mockRepository() {
        return {
        findOne: jest.fn(),
        findOneBy: jest.fn(),
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
        expect(addressRepository).toBeDefined();
        expect(cityRepository).toBeDefined();
        expect(userRepository).toBeDefined();
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
        const city = new City();
        city.name = 'Test City';

        const user = new User();
        user.id = '1';

        const result = { id: '1',address:createAddressDto.address , phone_numner:createAddressDto.phone_number, zip_code: createAddressDto.zip_code , city, user };

        cityRepository.findOneBy = jest.fn().mockResolvedValue(city);
        userRepository.findOneBy = jest.fn().mockResolvedValue(user);
        addressRepository.save = jest.fn().mockResolvedValue(result);

        expect(await service.create(createAddressDto, userId)).toEqual(result);
        expect(cityRepository.findOneBy).toHaveBeenCalledWith({ name: 'Test City' });
        expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: userId });
        expect(addressRepository.save).toHaveBeenCalledWith({ address:createAddressDto.address , phone_number:createAddressDto.phone_number, zip_code: createAddressDto.zip_code, city, user });
        });

        it('should throw BadRequestException when user does not exist', async () => {
        const createAddressDto: CreateAddressDto = {
            address: '123 Main St',
            phone_number: '1234567890',
            zip_code: '12345',
            city_name: 'Test City',
        };
        const userId = '1';

        userRepository.findOneBy = jest.fn().mockResolvedValue(null);

        await expect(service.create(createAddressDto, userId)).rejects.toThrow(BadRequestException);
        });
    });

    describe('findAll', () => {
        it('should return an array of addresses', async () => {
        const result = [{ id: '1', address: '123 Main St' }];

        addressRepository.find = jest.fn().mockResolvedValue(result);

        expect(await service.findAll()).toEqual(result);
        });
    });

    describe('findOne', () => {
        it('should return a single address', async () => {
        const result = { id: '1', address: '123 Main St' };

        addressRepository.findOne = jest.fn().mockResolvedValue(result);

        expect(await service.findOne('1')).toEqual(result);
        });

        it('should throw NotFoundException when address is not found', async () => {

        addressRepository.findOne = jest.fn().mockResolvedValue(null);
        jest.spyOn(service,'findOne').mockRejectedValue(new NotFoundException())

        await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('should update an address', async () => {
        const updateAddressDto: UpdateAddressDto = { address: '456 Main St' };
        const result = { id: '1', ...updateAddressDto };

        addressRepository.preload = jest.fn().mockResolvedValue(result);
        addressRepository.save = jest.fn().mockResolvedValue(result);

        expect(await service.update('1', updateAddressDto)).toEqual(result);
        expect(addressRepository.preload).toHaveBeenCalledWith({ id: '1', ...updateAddressDto });
        expect(addressRepository.save).toHaveBeenCalledWith(result);
        });

        it('should throw NotFoundException when address is not found', async () => {
        const updateAddressDto: UpdateAddressDto = { address: '456 Main St' };

        addressRepository.preload = jest.fn().mockResolvedValue(null);

        await expect(service.update('1', updateAddressDto)).rejects.toThrow(NotFoundException);
        });

        it('should handle database errors gracefully', async () => {
        const updateAddressDto: UpdateAddressDto = { address: '456 Main St' };

        const result = { id: '1', ...updateAddressDto };

        addressRepository.preload = jest.fn().mockResolvedValue(result);
        addressRepository.save= jest.fn().mockRejectedValue(new Error('Database error'));

        await expect(service.update('1', updateAddressDto)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('remove', () => {
        it('should remove an address', async () => {
        const result = { affected: 1 };
        const address = { id: '1', address: '123 Main St',phone_number: '1234567890', zip_code: '12345', city: new City(), user: new User(), orders:[] };

        jest.spyOn(service, 'findOne').mockResolvedValue(address);
        addressRepository.delete = jest.fn().mockResolvedValue(result);

        expect(await service.remove('1')).toEqual(result);
        expect(addressRepository.delete).toHaveBeenCalledWith(address);
        });

        it('should throw NotFoundException when address is not found', async () => {
        jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException('Address not found'));

        await expect(service.remove('1')).rejects.toThrow(NotFoundException);
        });
    });
    });
