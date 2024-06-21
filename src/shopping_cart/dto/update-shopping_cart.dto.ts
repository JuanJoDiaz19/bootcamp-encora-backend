import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsIn, IsString, IsUUID } from 'class-validator';
import { CreateShoppingCartDto } from './create-shopping_cart.dto';

export class UpdateShoppingCartDto {
  @IsArray()
  @IsUUID('4', { each: true })
  productIds: string[];

  @IsString()
  @IsIn(['add', 'remove'])
  operation: 'add' | 'remove';
}