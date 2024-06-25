import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";

@Entity()
export class OrderStatus {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name:string;

    @OneToMany(()=>Order,(order)=>order.status, {nullable:true})
    orders : Order[];
}
