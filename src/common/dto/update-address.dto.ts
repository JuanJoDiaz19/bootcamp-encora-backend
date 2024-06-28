import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateAddressDto } from './create-address.dto';

export class UpdateAddressDto extends PartialType(CreateAddressDto) {
  @ApiPropertyOptional({ description: 'Phone number of the user' })
  phone_number?: string;

  @ApiPropertyOptional({ description: 'Address of the user' })
  address?: string;

  @ApiPropertyOptional({ description: 'Zip code of the address' })
  zip_code?: string;

  @ApiPropertyOptional({ description: 'City name of the address' })
  city_name?: string;
}
