import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class PaymentMethod {
  @ApiProperty({
    description: 'The unique identifier for the payment method',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851'
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'The name of the payment method',
    example: 'Credit Card'
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'The orders associated with this payment method',
    type: () => Order,
    isArray: true,
    nullable: true
  })
  @OneToMany(() => Order, (order) => order.payment_method, { nullable: true })
  orders: Order[];
}
