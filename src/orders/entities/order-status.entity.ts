import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class OrderStatus {
  @ApiProperty({
    description: 'The unique identifier for the order status',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851'
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'The name of the order status',
    example: 'Pending'
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'The orders associated with this status',
    type: () => Order,
    isArray: true,
    nullable: true
  })
  @OneToMany(() => Order, (order) => order.status, { nullable: true })
  orders: Order[];
}
