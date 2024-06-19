import { Injectable } from '@nestjs/common';
import { CreateAddressDto } from '../dto/create-address.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from '../entities/Address.entity';
import { Repository } from 'typeorm';
import { City } from '../entities/City.entity';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class AddressService {

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
        
        const address_saved: Address = {
            ...address, 
            city, 
            user
        }

        return address_saved;
    }

    // findAll() {
    //     return `This action returns all shoppingCart`;
    // }

    // findOne(id: number) {
    //     return `This action returns a #${id} shoppingCart`;
    // }

    // update(id: number, updateShoppingCartDto: UpdateShoppingCartDto) {
    //     return `This action updates a #${id} shoppingCart`;
    // }

    // remove(id: number) {
    //     return `This action removes a #${id} shoppingCart`;
    // }
}
