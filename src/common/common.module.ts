import { Module, forwardRef } from '@nestjs/common';
import { City } from './entities/City.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from './entities/Department.entity';
import { Address } from './entities/Address.entity';
import { AddressController } from './controllers/address.controller';
import { AddressService } from './services/address.service';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/auth/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([City, Department, Address, User]),
  ],
  controllers: [AddressController],
  providers: [AddressService],
})
export class CommonModule {}
