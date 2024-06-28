import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateGroupDto } from './create-group.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateGroupDto extends PartialType(CreateGroupDto) {
  @ApiPropertyOptional({
    description: 'The name of the group',
    example: 'Fitness Equipment',
  })
  @IsOptional()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'The description of the group',
    example: 'Group for all fitness related products',
  })
  @IsOptional()
  @IsString()
  description: string;

  @ApiPropertyOptional({
    description: 'The URL of the group image',
    example: 'https://example.com/images/group.jpg',
  })
  @IsOptional()
  @IsString()
  image_url: string;

  @ApiPropertyOptional({
    description: 'The existing image URL of the group',
    example: 'https://example.com/images/existing_group.jpg',
  })
  @IsOptional()
  @IsString()
  existing_image: string;
}
