import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AddressService } from '../services/address.service';
import { CreateAddressDto } from '../dto/create-address.dto';
import { UpdateAddressDto } from '../dto/update-address.dto';
import { Address } from '../entities/Address.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('address')
@Controller('address')
export class AddressController {

  constructor(
    private readonly addressService: AddressService
  ) {}

  @Post('/user/:id_user')
  @ApiOperation({ summary: 'Create a new address for a user' })
  @ApiParam({ name: 'id_user', description: 'The ID of the user' })
  @ApiBody({ type: CreateAddressDto })
  @ApiResponse({ status: 201, description: 'The address has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createAddressDto: CreateAddressDto, @Param('id_user') id_user: string) {
    return this.addressService.create(createAddressDto, id_user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all addresses' })
  @ApiResponse({ status: 200, description: 'Return all addresses.', type: [Address] })
  findAll() {
    return this.addressService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get address by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the address' })
  @ApiResponse({ status: 200, description: 'Return the address.', type: Address })
  @ApiResponse({ status: 404, description: 'Address not found.' })
  findOne(@Param('id') id: string) {
    return this.addressService.findOne(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all addresses for a user by user ID' })
  @ApiParam({ name: 'userId', description: 'The ID of the user' })
  @ApiResponse({ status: 200, description: 'Return all addresses for the user.', type: [Address] })
  async getAddressesByUserId(@Param('userId') userId: string): Promise<Address[]> {
    return this.addressService.getAddressesByUserId(userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an address by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the address' })
  @ApiBody({ type: UpdateAddressDto })
  @ApiResponse({ status: 200, description: 'The address has been successfully updated.', type: Address })
  @ApiResponse({ status: 404, description: 'Address not found.' })
  update(@Param('id') id: string, @Body() UpdateAddressDto: UpdateAddressDto) {
    return this.addressService.update(id, UpdateAddressDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an address by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the address' })
  @ApiResponse({ status: 200, description: 'The address has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Address not found.' })
  remove(@Param('id') id: string) {
    return this.addressService.remove(id);
  }
}
