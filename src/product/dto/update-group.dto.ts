import { PartialType } from '@nestjs/mapped-types';
import { CreateGroupDto } from './create-group.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateGroupDto extends PartialType(CreateGroupDto) {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  image_url: string;

  @IsOptional()
  @IsString()
  existing_image: string;
}
