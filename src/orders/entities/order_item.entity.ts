import { Product } from "src/product/entities/product.entity";
import { JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";

export class OrderItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(()=>Product)
    @JoinColumn()
    product: Product;

    @ManyToOne(()=>Order, (order)=>order.items)
    order: Order;
}