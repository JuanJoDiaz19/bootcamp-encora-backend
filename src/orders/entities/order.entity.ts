import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderItem } from "./order_item.entity";
import { OrderStatus } from "./order-status.entity";
import { User } from "../../auth/entities/user.entity";
import { Address } from "../../common/entities/Address.entity";
import { PaymentMethod } from "./payment_method.entity";
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Order {
    @ApiProperty({
        description: 'The unique identifier of the order',
        example: 'e1b1c6c0-35c6-4b7e-8f15-2a576aa74f57'
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        description: 'The total price of the order',
        example: 199.99
    })
    @Column({ type: 'decimal', precision: 10, scale: 2})
    total_price: number;

    @ApiProperty({
        description: 'The status of the order',
        type: () => OrderStatus
    })
    @ManyToOne(()=> OrderStatus, (status)=>status.orders)
    status : OrderStatus;

    @ApiProperty({
        description: 'The creation date of the order',
        example: '2023-06-23T18:25:43.511Z'
    })
    @CreateDateColumn()
    creation_date: Date;

    @ApiProperty({
        description: 'The shipment date of the order',
        example: '2023-06-24T18:25:43.511Z',
        nullable: true
    })
    @Column({type: 'timestamp', nullable:true})
    shipment_date: Date;

    @ApiProperty({
        description: 'The received date of the order',
        example: '2023-06-25T18:25:43.511Z',
        nullable: true
    })
    @Column({type: 'timestamp', nullable:true})
    received_date: Date;

    @ApiProperty({
        description: 'The items included in the order',
        type: () => OrderItem,
        isArray: true
    })
    @OneToMany(()=>OrderItem, (item)=>item.order)
    items: OrderItem[];

    @ApiProperty({
        description: 'The user who placed the order',
        type: () => User
    })
    @ManyToOne(()=>User, (user)=>user.orders)
    user: User;

    @ApiProperty({
        description: 'The address where the order is to be delivered',
        type: () => Address
    })
    @ManyToOne(() => Address, (address) => address.orders)
    address : Address;

    @ApiProperty({
        description: 'The payment method used for the order',
        type: () => PaymentMethod
    })
    @ManyToOne(() => PaymentMethod, (payment) => payment.orders)
    payment_method: PaymentMethod;
}
