import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "./role.entity";
import { Address } from "../../common/entities/Address.entity";
import { ShoppingCart } from "../../shopping_cart/entities/shopping_cart.entity";
import { Order } from "../../orders/entities/order.entity";
import { Review } from "../../product/entities/review.entity";

@Entity()
export class User { 
    @ApiProperty({
        description: 'Unique identifier for the user',
        type: String,
        format: 'uuid'
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        description: 'Email of the user',
        type: String,
        uniqueItems: true,
        example: 'user@example.com'
    })
    @Column('text',{
        unique:true,
        nullable:false
    })
    email: string;

    @ApiProperty({
        description: 'First name of the user',
        type: String,
        example: 'John'
    })
    @Column('text',{
        nullable:false
    })
    first_name: string;

    @ApiProperty({
        description: 'Last name of the user',
        type: String,
        example: 'Doe'
    })
    @Column('text',{
        nullable:false
    })
    last_name: string;

    @ApiProperty({
        description: 'Password of the user',
        type: String,
        writeOnly: true
    })
    @Column('text',{
        nullable:false
    })
    password: string;

    @ApiProperty({
        description: 'Birth date of the user',
        type: String,
        format: 'date',
        required: false
    })
    @Column('date', { 
        nullable: true 
    })
    birth_date: Date;

    @ApiProperty({
        description: 'Reviews written by the user',
        type: () => [Review],
        isArray: true
    })
    @OneToMany(() => Review, (review) => review.user)
    reviews: Review[];

    @ApiProperty({
        description: 'Role of the user',
        type: () => Role
    })
    @ManyToOne(() => Role, (role) => role.users)
    role: Role;

    @ApiProperty({
        description: 'Addresses associated with the user',
        type: () => [Address],
        isArray: true
    })
    @OneToMany(() => Address, (address) => address.user)
    addresses: Address[];

    @ApiProperty({
        description: 'Orders placed by the user',
        type: () => [Order],
        isArray: true
    })
    @OneToMany(() => Order, (order) => order.user)
    orders: Order[];

    @ApiProperty({
        description: 'Shopping cart associated with the user',
        type: () => ShoppingCart,
        nullable: true
    })
    @OneToOne(() => ShoppingCart, (shoppingCart) => shoppingCart.user, { cascade: true })
    shoppingCart: ShoppingCart;
}
