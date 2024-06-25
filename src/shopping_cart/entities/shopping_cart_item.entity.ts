import { Product } from "../../product/entities/product.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ShoppingCart } from "./shopping_cart.entity";

@Entity()
export class ShoppingCartItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(()=>Product, (product)=>product.shopping_cart_items)
    product: Product;

    @Column()
    quantity: number;

    @Column('float')
    price: number;

    @ManyToOne(()=>ShoppingCart, (cart)=>cart.items)
    shopping_cart: ShoppingCart;
}