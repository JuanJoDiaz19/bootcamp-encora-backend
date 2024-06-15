import { Product } from "src/product/entities/product.entity";
import { Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ShoppingCart } from "./shopping_cart.entity";

@Entity()
export class ShoppingCartItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(()=>Product, (product)=>product.shopping_cart_items)
    product: Product;

    @ManyToOne(()=>ShoppingCart, (cart)=>cart.items)
    shopping_cart: ShoppingCart;
}