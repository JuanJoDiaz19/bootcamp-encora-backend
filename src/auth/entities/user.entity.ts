import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "./role.entity";
import { Address } from "src/common/entities/Address.entity";
import { ShoppingCart } from "src/shopping_cart/entities/shopping_cart.entity";
import { Order } from "src/orders/entities/order.entity";
import { Review } from "src/product/entities/review.entity";


@Entity()
export class User { 

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text',{
        unique:true,
        nullable:false
    })
    email: string;

    @Column('text',{
        nullable:false
    })
    first_name: string;

    @Column('text',{
        nullable:false
    })
    last_name: string;

    
    @Column('text',{
        nullable:false
    })
    password: string;


    @Column('date', { 
        nullable: true 
    })
    birth_date: Date;

    @OneToMany(() => Review, (review) => review.user)
    reviews: Review[];

    @ManyToOne( () => Role, (role) => role.users)
    role: Role;

    @OneToMany(() => Address, (address) => address.user)
    addresses: Address[];

    @OneToMany(() => Order, (order) => order.user)
    orders: Order[];

    @OneToOne(() => ShoppingCart, (shoppingCart) => shoppingCart.user, { cascade: true })
    @JoinColumn()
    shoppingCart: ShoppingCart;

}