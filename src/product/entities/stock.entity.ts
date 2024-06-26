import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity()
export class Stock{

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    stock:number;

    @Column({nullable:true})
    unities_sold: number;

    @OneToOne(()=>Product, (product)=> product.stock)
    @JoinColumn()
    product:Product
}