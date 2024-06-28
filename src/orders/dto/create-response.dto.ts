import { IsString, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateResponseDto {

  @ApiProperty({
    description: 'The message received in the response',
    example: 'Payment successful'
  })
  @IsString()
  message: string;

  @ApiProperty({
    description: 'The reference code of the transaction',
    example: 'ABC123'
  })
  @IsString()
  referenceCode: string;

  @ApiProperty({
    description: 'The payment method used',
    example: 'VISA'
  })
  @IsString()
  lapPaymentMethod: string;

  @ApiProperty({
    description: 'The type of the payment method',
    example: 'Credit Card'
  })
  @IsString()
  lapPaymentMethodType: string;

  @ApiProperty({
    description: 'The date when the processing occurred',
    example: '2024-06-23T18:25:43.511Z'
  })
  @IsDate()
  processingDate: Date;
}
