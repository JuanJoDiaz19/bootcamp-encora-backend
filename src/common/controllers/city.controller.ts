import { Controller, Get, Param } from '@nestjs/common';
import { CityService } from '../services/city.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { City } from '../entities/city.entity';

@ApiTags('city')
@Controller('city')
export class CityController {

  constructor(
    private readonly cityService: CityService
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all cities' })
  @ApiResponse({ status: 200, description: 'Return all cities.', type: [City] })
  findAll() {
    return this.cityService.findAll();
  }

  @Get(':name')
  @ApiOperation({ summary: 'Get city by name' })
  @ApiParam({ name: 'name', description: 'The name of the city' })
  @ApiResponse({ status: 200, description: 'Return the city.', type: City })
  @ApiResponse({ status: 404, description: 'City not found.' })
  findOne(@Param('name') name: string) {
    return this.cityService.findOne(name);
  }
}
