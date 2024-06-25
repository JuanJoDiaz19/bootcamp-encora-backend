import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderItem } from "./order_item.entity";
import { OrderStatus } from "./order-status.entity";
import { User } from "../../auth/entities/user.entity";
import { Address } from "../../common/entities/Address.entity";
import { PaymentMethod } from "./payment_method.entity";

@Entity()
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'decimal', precision: 10, scale: 2})
    total_price: number;

    @ManyToOne(()=> OrderStatus, (status)=>status.orders)
    status : OrderStatus;

    @CreateDateColumn()
    creation_date: Date;

    @Column({type: 'timestamp', nullable:true})
    shipment_date: Date;

    @Column({type: 'timestamp', nullable:true})
    received_date: Date;

    @OneToMany(()=>OrderItem, (item)=>item.order)
    items: OrderItem[]

    @ManyToOne(()=>User, (user)=>user.orders)
    user: User;

    @ManyToOne(() => Address, (address) => address.orders)
    address : Address;

    @ManyToOne(() => PaymentMethod, (payment) => payment.orders)
    payment_method: PaymentMethod;

}
