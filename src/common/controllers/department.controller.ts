import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AddressService } from '../services/address.service';
import { CreateAddressDto } from '../dto/create-address.dto';
import { UpdateAddressDto } from '../dto/update-address.dto';
import { DepartmentService } from '../services/department.service';

@Controller('department')
export class DepartmentController {

  constructor(
    private readonly departmentService: DepartmentService
  ) {}

  @Get()
  findAll() {
    return this.departmentService.findAll();
  }

  @Get(':name')
  findOne(@Param('name') id: string) {
    return this.departmentService.findOne(id);
  }

}
