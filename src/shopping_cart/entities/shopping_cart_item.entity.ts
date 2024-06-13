import { Product } from "src/product/entities/product.entity";
import { JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ShoppingCart } from "./shopping_cart.entity";

export class CartItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(()=>Product)
    @JoinColumn()
    product: Product;

    @ManyToOne(()=>ShoppingCart, (cart)=>cart.items)
    cart: ShoppingCart;
}