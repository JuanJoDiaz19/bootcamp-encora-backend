import { Product } from "src/product/entities/product.entity";
import { Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";

@Entity()
export class OrderItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(()=> Product, (product) => product)
    product: Product;

    @ManyToOne(()=>Order, (order)=>order.items)
    order: Order;
}