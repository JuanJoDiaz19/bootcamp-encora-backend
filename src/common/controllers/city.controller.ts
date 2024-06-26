import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AddressService } from '../services/address.service';
import { CreateAddressDto } from '../dto/create-address.dto';
import { UpdateAddressDto } from '../dto/update-address.dto';
import { CityService } from '../services/city.service';

@Controller('city')
export class CityController {

  constructor(
    private readonly cityService: CityService
  ) {}


  @Get()
  findAll() {
    return this.cityService.findAll();
  }

  @Get(':name')
  findOne(@Param('name') name: string) {
    return this.cityService.findOne(name);
  }

}
