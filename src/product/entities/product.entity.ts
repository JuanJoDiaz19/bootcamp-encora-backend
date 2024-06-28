import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Category } from './category.entity';
import { Stock } from './stock.entity';
import { Review } from './review.entity';
import { OrderItem } from '../../orders/entities/order_item.entity';
import { ShoppingCartItem } from '../../shopping_cart/entities/shopping_cart_item.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Product {
  @ApiProperty({ description: 'The unique identifier of the product' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'The name of the product' })
  @Column()
  name: string;

  @ApiProperty({ description: 'The type of the product', nullable: true })
  @Column({ nullable: true })
  type: string;

  @ApiProperty({ description: 'The creation date of the product' })
  @CreateDateColumn()
  creation_date: Date;

  @ApiProperty({ description: 'The description of the product' })
  @Column()
  description: string;

  @ApiProperty({ description: 'The price of the product', type: 'number', example: 29.99 })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @ApiProperty({ description: 'The rating of the product', type: 'number', example: 4.5, default: 0.0 })
  @Column({
    default: 0.0,
    type: 'float',
  })
  rating: number;

  @ApiProperty({ description: 'The URLs of the product images', type: 'string', isArray: true })
  @Column('text', { array: true })
  image_urls: string[];

  @ApiProperty({ description: 'The category of the product', type: () => Category })
  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @ApiProperty({
    description: 'The status of the product',
    enum: ['Activo', 'Inactivo', 'Agotado'],
    example: 'Activo',
    default: 'Activo',
  })
  @Column({
    type: 'enum',
    enum: ['Activo', 'Inactivo', 'Agotado'],
    default: 'Activo',
  })
  status: string;

  @ApiProperty({ description: 'The stock details of the product', type: () => Stock })
  @OneToOne(() => Stock, (stock) => stock.product)
  stock: Stock;

  @ApiProperty({ description: 'The reviews of the product', type: () => Review, isArray: true, nullable: true })
  @OneToMany(() => Review, (review) => review.product, { nullable: true })
  reviews: Review[];

  @ApiProperty({ description: 'The order items of the product', type: () => OrderItem, isArray: true, nullable: true })
  @OneToMany(() => OrderItem, (order_item) => order_item.product, { nullable: true })
  order_items: OrderItem[];

  @ApiProperty({ description: 'The shopping cart items of the product', type: () => ShoppingCartItem, isArray: true, nullable: true })
  @OneToMany(
    () => ShoppingCartItem,
    (shoppping_cart_item) => shoppping_cart_item.product,
    { nullable: true },
  )
  shopping_cart_items: ShoppingCartItem[];
}
