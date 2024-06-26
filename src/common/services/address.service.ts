import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateAddressDto } from '../dto/create-address.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from '../entities/Address.entity';
import { Repository } from 'typeorm';
import { City } from '../entities/City.entity';
import { User } from '../../auth/entities/user.entity';
import { UpdateAddressDto } from '../dto/update-address.dto';

@Injectable()
export class AddressService {

    private readonly logger = new Logger('AddressService');

    constructor(
        @InjectRepository(Address)
        private readonly addressRepository: Repository<Address>,
        @InjectRepository(City)
        private readonly CityRepository: Repository<City>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
      ) {}

    async create(createAddressDto: CreateAddressDto, user_id: string) {
        const {city_name, ...address} = createAddressDto;
        const city = await this.CityRepository.findOneBy(
            {name: city_name}
        );

        const user = await this.userRepository.findOneBy(
            {id: user_id}
        )

        if(!user){
            throw new BadRequestException(`User ${user_id} doesnt exist`);
        }
        
        const address_saved = {
            ...address, 
            city, 
            user
        }

        return this.addressRepository.save(address_saved);
    }

    findAll() {
        return this.addressRepository.find();
    }

    findOne(id: string) : Promise<Address>{
        return this.addressRepository.findOne({ where:{id: id },relations: ['city']});
    }

    async update(id: string, updateAddressDto: UpdateAddressDto) {

        const address = await this.addressRepository.preload({
            id: id, 
            ... updateAddressDto
        });

        if ( !address ) throw new NotFoundException(`Address with id: ${ id } not found`);

        try {
            await this.addressRepository.save( address );
            return address;
        } catch (error) {
            this.handleDBExceptions(error);
        } 
    }

    async remove(id: string) {
        const address = await this.findOne(id);
        return this.addressRepository.delete(address);
    }

    private handleDBExceptions( error: any ) {

        if ( error.code === '23505' )
          throw new BadRequestException(error.detail);
        
        // console.log(error)
        this.logger.error(error);
        throw new InternalServerErrorException('Unexpected error, check server logs');
    
      }
}
