import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AddressService } from '../services/address.service';
import { CreateAddressDto } from '../dto/create-address.dto';
import { UpdateAddressDto } from '../dto/update-address.dto';
import { Address } from '../entities/Address.entity';

@Controller('address')
export class AddressController {

  constructor(
    private readonly addressService: AddressService
  ) {}

  @Post('/user/:id_user')
  create(@Body() createAddressDto: CreateAddressDto, @Param('id_user') id_user: string) {
    return this.addressService.create(createAddressDto, id_user);
  }

  @Get()
  findAll() {
    return this.addressService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.addressService.findOne(id);
  }
  @Get('user/:userId')
  async getAddressesByUserId(@Param('userId') userId: string): Promise<Address[]> {
    return this.addressService.getAddressesByUserId(userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() UpdateAddressDto: UpdateAddressDto) {
    return this.addressService.update(id, UpdateAddressDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.addressService.remove(id);
  }

}
