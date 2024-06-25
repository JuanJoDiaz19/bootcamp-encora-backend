import { Product } from "src/product/entities/product.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ShoppingCart } from "./shopping_cart.entity";

@Entity()
export class ShoppingCartItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Product, (product) => product.shopping_cart_items)
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @Column()
    quantity: number;

    @Column('float')
    price: number;

    @Column('float')
    sub_total: number;

    @ManyToOne(() => ShoppingCart, (cart) => cart.items)
    shoppingCart: ShoppingCart;
}
