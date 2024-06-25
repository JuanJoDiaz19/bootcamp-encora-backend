import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ShoppingCart } from "./shopping_cart.entity";

@Entity()
export class ShoppingCartStatus {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    status: string;

    @OneToMany(() => ShoppingCart, (shopppingCart) => shopppingCart.status, {
        cascade: true,
    })
    shopping_carts: ShoppingCart[];
}
