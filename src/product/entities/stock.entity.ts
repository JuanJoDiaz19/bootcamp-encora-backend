import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Stock {
  @ApiProperty({ description: 'The unique identifier of the stock' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'The quantity of stock available' })
  @Column()
  stock: number;

  @ApiProperty({ description: 'The number of units sold', nullable: true })
  @Column({ nullable: true })
  unities_sold: number;

  @ApiProperty({ description: 'The quantity of stock reserved', default: 0 })
  @Column({ default: 0 })
  reserved_stock: number;

  @ApiProperty({ description: 'The product associated with this stock', type: () => Product })
  @OneToOne(() => Product, (product) => product.stock, { onDelete: 'CASCADE' })
  @JoinColumn()
  product: Product;
}
