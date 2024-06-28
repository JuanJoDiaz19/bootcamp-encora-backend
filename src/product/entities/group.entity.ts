import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "./category.entity";
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Group {

    @ApiProperty({ description: 'The unique identifier of the group' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'The name of the group', uniqueItems: true })
    @Column({ unique: true })
    name: string;

    @ApiProperty({ description: 'The description of the group', nullable: true })
    @Column({ nullable: true })
    description: string;

    @ApiProperty({ description: 'The categories belonging to the group', type: () => Category, isArray: true })
    @OneToMany(() => Category, (category) => category.group, { cascade: true })
    categories: Category[];

    @ApiProperty({ description: 'The image URL of the group' })
    @Column()
    image_url: string;
}
