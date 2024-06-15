import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ShoppingCartItem } from "./shopping_cart_item.entity";

@Entity()
export class ShoppingCart {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToMany(()=>ShoppingCartItem, (shopping_cart_item)=>shopping_cart_item.shopping_cart)
    items: ShoppingCartItem[];

    @Column()
    sub_total: number;

    //ToDo (Relación con ShoppingCartStatus)
    @Column()
    status: string;
}
