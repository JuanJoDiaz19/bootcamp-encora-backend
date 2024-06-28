import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ShoppingCart } from "./shopping_cart.entity";

@Entity()
export class ShoppingCartStatus {
    @ApiProperty({
        description: 'Unique identifier for the shopping cart status',
        type: String,
        format: 'uuid'
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        description: 'Status of the shopping cart',
        type: String,
        example: 'Pending'
    })
    @Column()
    status: string;

    @ApiProperty({
        description: 'List of shopping carts associated with this status',
        type: () => [ShoppingCart],
        isArray: true
    })
    @OneToMany(() => ShoppingCart, (shoppingCart) => shoppingCart.status, {
        cascade: true,
    })
    shopping_carts: ShoppingCart[];
}
