import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity()
export class Review {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('float')
    score: number;

    @Column()
    comment: string;

    @CreateDateColumn()
    publication_date: Date;

    @ManyToOne(()=>Product, (product)=>product.reviews)
    product: Product;
}