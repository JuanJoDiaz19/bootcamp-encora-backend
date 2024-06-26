import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateAddressDto } from '../dto/create-address.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from '../entities/Address.entity';
import { Repository } from 'typeorm';
import { City } from '../entities/City.entity';
import { User } from '../../auth/entities/user.entity';
import { UpdateAddressDto } from '../dto/update-address.dto';

@Injectable()
export class CityService {

    private readonly logger = new Logger('AddressService');

    constructor(
        @InjectRepository(City)
        private readonly cityRepository: Repository<City>,
      ) {}


    findAll() {
        return this.cityRepository.find();
    }

    findOne(name: string) : Promise<City>{
        const city = this.cityRepository.findOne({ where:{name: name },relations: ['department']});
        if (!city) {
            throw new NotFoundException(`No se encontró la ciudad con nombre ${name}`)
        }
        return city;
    }

    private handleDBExceptions( error: any ) {

        if ( error.code === '23505' )
          throw new BadRequestException(error.detail);
        
        // console.log(error)
        this.logger.error(error);
        throw new InternalServerErrorException('Unexpected error, check server logs');
    
      }
}
