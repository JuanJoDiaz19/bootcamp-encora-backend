import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToOne, OneToMany } from "typeorm";
import { Category } from "./category.entity";
import { Stock } from "./stock.entity";
import { Review } from "./review.entity";

@Entity()
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @CreateDateColumn() 
    creation_date: Date;

    @Column()
    description: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @ManyToOne(() => Category, (category) => category.products)
    category: Category;

    @OneToOne(()=>Stock)
    @JoinColumn()
    stock:Stock

    @OneToMany(()=>Review, (review)=> review.product)
    reviews: Review[]

}
