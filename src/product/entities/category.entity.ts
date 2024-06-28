import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";
import { Group } from "./group.entity";
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Category {

    @ApiProperty({ description: 'The unique identifier of the category' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'The name of the category', uniqueItems: true })
    @Column({ unique: true })
    name: string;

    @ApiProperty({ description: 'The description of the category', nullable: true })
    @Column({ nullable: true })
    description: string;

    @ApiProperty({ description: 'The products belonging to the category', type: () => Product, isArray: true })
    @OneToMany(() => Product, (product) => product.category)
    products: Product[];

    @ApiProperty({ description: 'The group this category belongs to', type: () => Group })
    @ManyToOne(() => Group, (group) => group.categories)
    group: Group;

    @ApiProperty({ description: 'The image URL of the category' })
    @Column()
    image_url: string;
}
