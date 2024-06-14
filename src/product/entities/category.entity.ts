import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { Product } from "./product.entity";
import { Group } from "./group.entity";

@Entity()
export class Category {
    @PrimaryColumn()
    name: string;

    @Column({nullable: true})
    description: string;

    @OneToMany(() => Product,(product) => product.category)
    products: Product[]

    @ManyToOne(()=>Group, (group)=>group.categories)
    group : Group;

    @Column()
    image_url: string;
}