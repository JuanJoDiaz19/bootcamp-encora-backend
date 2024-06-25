import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "./category.entity";

@Entity()
export class Group {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({unique:true})
    name: string;

    @Column({nullable: true})
    description: string;

    @OneToMany(() => Category,(category) => category.group, { cascade: true })
    categories: Category[]

    @Column()
    image_url:string;
}