import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity()
export class Category {
    @PrimaryColumn()
    name: string;

    @Column({nullable: true})
    description: string;

    @OneToMany(() => Product,(product) => product.category)
    products: Product[]
}