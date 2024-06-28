import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";
import { User } from "../../auth/entities/user.entity";
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Review {
    @ApiProperty({ description: 'The unique identifier of the review' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'The title of the review' })
    @Column()
    title: string;

    @ApiProperty({ description: 'The score given in the review', example: 4.5 })
    @Column('float')
    score: number;

    @ApiProperty({ description: 'The comment of the review' })
    @Column()
    comment: string;

    @ApiProperty({ description: 'The user who wrote the review', type: () => User })
    @ManyToOne(() => User, (user) => user.reviews)
    user: User;

    @ApiProperty({ description: 'The date when the review was published' })
    @CreateDateColumn()
    publication_date: Date;

    @ApiProperty({ description: 'The product that the review is for', type: () => Product })
    @ManyToOne(() => Product, (product) => product.reviews)
    product: Product;
}
