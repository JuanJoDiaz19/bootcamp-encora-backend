import { ApiProperty } from '@nestjs/swagger';
import { Product } from "../../product/entities/product.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";

@Entity()
export class OrderItem {
    @ApiProperty({
        description: 'Unique identifier for the order item',
        type: String,
        format: 'uuid'
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        description: 'Quantity of the product in the order',
        type: Number,
        example: 2
    })
    @Column()
    quantity: number;

    @ApiProperty({
        description: 'Product associated with the order item',
        type: () => Product
    })
    @ManyToOne(() => Product, (product) => product)
    product: Product;

    @ApiProperty({
        description: 'Order to which the item belongs',
        type: () => Order,
        nullable: true
    })
    @ManyToOne(() => Order, (order) => order.items, { nullable: true })
    order: Order;
}
