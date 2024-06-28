import { ApiProperty } from '@nestjs/swagger';
import { Product } from "../../product/entities/product.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ShoppingCart } from "./shopping_cart.entity";

@Entity()
export class ShoppingCartItem {
    @ApiProperty({
        description: 'Unique identifier for the shopping cart item',
        type: String,
        format: 'uuid'
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        description: 'Product associated with the shopping cart item',
        type: () => Product
    })
    @ManyToOne(() => Product, (product) => product.shopping_cart_items)
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @ApiProperty({
        description: 'Quantity of the product in the shopping cart item',
        type: Number,
        example: 1
    })
    @Column()
    quantity: number;

    @ApiProperty({
        description: 'Price of the product in the shopping cart item',
        type: Number,
        example: 50.00
    })
    @Column('float')
    price: number;

    @ApiProperty({
        description: 'Subtotal amount for the shopping cart item',
        type: Number,
        example: 50.00
    })
    @Column('float')
    sub_total: number;

    @ApiProperty({
        description: 'Shopping cart associated with the shopping cart item',
        type: () => ShoppingCart
    })
    @ManyToOne(() => ShoppingCart, (cart) => cart.items)
    shoppingCart: ShoppingCart;
}
