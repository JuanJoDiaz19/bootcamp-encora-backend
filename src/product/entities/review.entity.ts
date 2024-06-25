import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";
import { User } from "../../auth/entities/user.entity";

@Entity()
export class Review {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column('float')
    score: number;

    @Column()
    comment: string;

    @ManyToOne(() => User, (user) => user.reviews)
    user: User;

    @CreateDateColumn()
    publication_date: Date;

    @ManyToOne(()=>Product, (product)=>product.reviews)
    product: Product;
}