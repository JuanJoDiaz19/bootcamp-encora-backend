import { Module, forwardRef } from '@nestjs/common';
import { City } from './entities/City.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from './entities/Department.entity';
import { Address } from './entities/Address.entity';
import { AddressController } from './controllers/address.controller';
import { AddressService } from './services/address.service';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/auth/entities/user.entity';
import { DepartmentController } from './controllers/department.controller';
import { CityController } from './controllers/city.controller';
import { DepartmentService } from './services/department.service';
import { CityService } from './services/city.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([City, Department, Address, User]),
  ],
  controllers: [AddressController, DepartmentController, CityController],
  providers: [AddressService, DepartmentService, CityService],
  exports: [AddressService]
})
export class CommonModule {}
