import { Column, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CartItem } from "./shopping_cart_item.entity";

export class ShoppingCart {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToMany(()=>CartItem, (item)=>item.cart)
    items: CartItem[];

    @Column()
    sub_total: number;

    //ToDo (Relación con ShoppingCartStatus)
    @Column()
    status: string;
}
