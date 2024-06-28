import { Controller, Get, Param } from '@nestjs/common';
import { DepartmentService } from '../services/department.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Department } from '../entities/department.entity'; 

@ApiTags('department')
@Controller('department')
export class DepartmentController {

  constructor(
    private readonly departmentService: DepartmentService
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all departments' })
  @ApiResponse({ status: 200, description: 'Return all departments.', type: [Department] })
  findAll() {
    return this.departmentService.findAll();
  }

  @Get(':name')
  @ApiOperation({ summary: 'Get department by name' })
  @ApiParam({ name: 'name', description: 'The name of the department' })
  @ApiResponse({ status: 200, description: 'Return the department.', type: Department })
  @ApiResponse({ status: 404, description: 'Department not found.' })
  findOne(@Param('name') name: string) {
    return this.departmentService.findOne(name);
  }

}
