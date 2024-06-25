import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToOne, OneToMany } from "typeorm";
import { Category } from "./category.entity";
import { Stock } from "./stock.entity";
import { Review } from "./review.entity";
import { OrderItem } from "../../orders/entities/order_item.entity";
import { ShoppingCartItem } from "../../shopping_cart/entities/shopping_cart_item.entity";

@Entity()
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({nullable:true})
    type: string;

    @CreateDateColumn() 
    creation_date: Date;

    @Column()
    description: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @Column({
        default: 0.0
    })
    rating: number;

    @Column('text', { array: true })
    image_urls:string[];

    @ManyToOne(() => Category, (category) => category.products)
    category: Category;

    @Column({
        type: 'enum',
        enum: ['Activo', 'Inactivo', 'Agotado'],
        default: 'Activo'
    })
    status: string;

    @OneToOne(()=>Stock)
    @JoinColumn()
    stock:Stock

    @OneToMany(()=>Review, (review)=> review.product,{ nullable: true })
    reviews: Review[]

    @OneToMany(()=>OrderItem, (order_item)=> order_item.product,{ nullable: true })
    order_items: OrderItem[]

    @OneToMany(()=>ShoppingCartItem, (shoppping_cart_item)=> shoppping_cart_item.product,{ nullable: true })
    shopping_cart_items: ShoppingCartItem[]

}
