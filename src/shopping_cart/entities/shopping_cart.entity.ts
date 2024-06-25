import { Column, Entity, OneToMany, ManyToOne, JoinColumn, PrimaryGeneratedColumn, OneToOne } from "typeorm";
import { ShoppingCartItem } from "./shopping_cart_item.entity";
import { ShoppingCartStatus } from "./shopping_cart_status.entity";
import { User } from "src/auth/entities/user.entity";

@Entity()
export class ShoppingCart {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToMany(() => ShoppingCartItem, (item) => item.shoppingCart, {
      cascade: true,
    })
    items: ShoppingCartItem[];

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    sub_total: number;

    @ManyToOne(() => ShoppingCartStatus, (shopping_cart_status) => shopping_cart_status.shopping_carts)
    status: ShoppingCartStatus;

    @OneToOne(() => User, (user) => user.shoppingCart)
    @JoinColumn()
    user: User;
}
