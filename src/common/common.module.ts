import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { CommonController } from './common.controller';
import { City } from './entities/City.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from './entities/Department.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([City]),
    TypeOrmModule.forFeature([Department]),
  ],
  controllers: [CommonController],
  providers: [CommonService],
})
export class CommonModule {}
