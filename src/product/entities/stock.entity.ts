import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Stock{

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    stock:number;

    @Column()
    unities_sold: number;
}