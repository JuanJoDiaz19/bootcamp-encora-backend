import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, ManyToOne, JoinColumn, PrimaryGeneratedColumn, OneToOne } from "typeorm";
import { ShoppingCartItem } from "./shopping_cart_item.entity";
import { ShoppingCartStatus } from "./shopping_cart_status.entity";
import { User } from "../../auth/entities/user.entity";

@Entity()
export class ShoppingCart {
    @ApiProperty({
        description: 'Unique identifier for the shopping cart',
        type: String,
        format: 'uuid'
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        description: 'List of items in the shopping cart',
        type: () => [ShoppingCartItem]
    })
    @OneToMany(() => ShoppingCartItem, (item) => item.shoppingCart, {
      cascade: true,
    })
    items: ShoppingCartItem[];

    @ApiProperty({
        description: 'Subtotal amount of the shopping cart',
        type: Number,
        example: 100.00
    })
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    sub_total: number;

    @ApiProperty({
        description: 'Status of the shopping cart',
        type: () => ShoppingCartStatus
    })
    @ManyToOne(() => ShoppingCartStatus, (shopping_cart_status) => shopping_cart_status.shopping_carts)
    status: ShoppingCartStatus;

    @ApiProperty({
        description: 'User associated with the shopping cart',
        type: () => User
    })
    @OneToOne(() => User, (user) => user.shoppingCart)
    @JoinColumn()
    user: User;
}
