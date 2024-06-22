import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";
import { Group } from "./group.entity";

@Entity()
export class Category {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({unique:true})
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