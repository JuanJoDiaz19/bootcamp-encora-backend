import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Category } from "./category.entity";

@Entity()
export class Group {
    @PrimaryColumn()
    name: string;

    @Column({nullable: true})
    description: string;

    @OneToMany(() => Category,(category) => category.group)
    categories: Category[]

    @Column()
    image_url:string;
}