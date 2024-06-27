import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateAddressDto } from '../dto/create-address.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from '../entities/Address.entity';
import { Repository } from 'typeorm';
import { City } from '../entities/City.entity';
import { User } from '../../auth/entities/user.entity';
import { UpdateAddressDto } from '../dto/update-address.dto';
import { Department } from '../entities/Department.entity';

@Injectable()
export class DepartmentService {

    private readonly logger = new Logger('AddressService');

    constructor(
        @InjectRepository(Department)
        private readonly departmentRepository: Repository<Department>,
      ) {}


    findAll() {
        return this.departmentRepository.find();
    }

    findOne(name: string) : Promise<Department>{
        const department = this.departmentRepository.findOne({ where:{name: name },relations: ['department']});
        if (!department) {
            throw new NotFoundException(`No se encontró el departamento con nombre ${department}`)
        }
        return department;
    }

    private handleDBExceptions( error: any ) {

        if ( error.code === '23505' )
          throw new BadRequestException(error.detail);
        
        // console.log(error)
        this.logger.error(error);
        throw new InternalServerErrorException('Unexpected error, check server logs');
    
      }
}
