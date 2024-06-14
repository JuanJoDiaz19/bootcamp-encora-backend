import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Stock{

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    stock:number;

    @Column({nullable:true})
    unities_sold: number;
}