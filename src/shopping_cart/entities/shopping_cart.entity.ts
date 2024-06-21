import { Column, Entity, OneToMany, ManyToOne, JoinColumn, PrimaryGeneratedColumn, OneToOne } from "typeorm";
import { ShoppingCartItem } from "./shopping_cart_item.entity";
import { ShoppingCartStatus } from "./shopping_cart_status.entity";
import { User } from "src/auth/entities/user.entity";

@Entity()
export class ShoppingCart {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToMany(() => ShoppingCartItem, (shopping_cart_item) => shopping_cart_item.shopping_cart)
    items: ShoppingCartItem[];

    //@Column('float')
    @Column()
    sub_total: number;

    // @ManyToOne(() => ShoppingCartStatus)
    // @JoinColumn({ name: 'status_id' })
    // status: ShoppingCartStatus;

    // @OneToOne(() => User, (user) => user.shoppingCart)
    // user: User;
}
