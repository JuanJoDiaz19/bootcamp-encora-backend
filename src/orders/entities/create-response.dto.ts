import { IsString, IsNumber, IsDate, IsOptional } from 'class-validator';
import { User } from '../../auth/entities/user.entity';

export class CreateResponseDto {

  @IsString()
  message: string;

  @IsString()
  referenceCode: string;

  @IsString()
  lapPaymentMethod: string;

  @IsString()
  lapPaymentMethodType: string;

  @IsDate()
  processingDate: Date;
}
