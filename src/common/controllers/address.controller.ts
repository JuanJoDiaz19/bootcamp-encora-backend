import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AddressService } from '../services/address.service';
import { CreateAddressDto } from '../dto/create-address.dto';

@Controller('address')
export class AddressController {

  constructor(
    private readonly addressService: AddressService
  ) {}

  @Post('/:id_user')
  create(@Body() createAddressDto: CreateAddressDto, @Param('id_user') id_user: string) {
    return this.addressService.create(createAddressDto, id_user);
  }

//   @Get()
//   findAll() {
//     return this.commonService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.commonService.findOne(+id);
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateCommonDto: UpdateCommonDto) {
//     return this.commonService.update(+id, updateCommonDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.commonService.remove(+id);
//   }

}
