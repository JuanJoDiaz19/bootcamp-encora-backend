import { Product } from "src/product/entities/product.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ShoppingCart } from "./shopping_cart.entity";

@Entity()
export class ShoppingCartStatus {

    @Column()
    shopping_cart_status: string;
    
}