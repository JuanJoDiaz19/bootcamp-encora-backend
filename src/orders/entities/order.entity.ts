import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderItem } from "./order_item.entity";

@Entity()
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'decimal', precision: 10, scale: 2})
    total_price: number;

    @CreateDateColumn()
    creation_date: Date;

    @Column({type: 'timestamp', nullable:true})
    shipment_date: Date;

    @Column({type: 'timestamp', nullable:true})
    received_date: Date;

    @OneToMany(()=>OrderItem, (item)=>item.order)
    items: OrderItem[]

}
