import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Department } from "./Department.entity";
import { City } from "./City.entity";
import { User } from "src/auth/entities/user.entity";
import { Order } from "src/orders/entities/order.entity";

@Entity()
export class Address { 

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        nullable: false
    })
    address: string;

    @Column( 'text',{
        nullable:false
    })
    phone_number: string;

    @Column('text', {
        nullable:false
    })
    zip_code: string;

    @ManyToOne(()=> City, (city) => city.addresses, {
        nullable: false
    })
    city: City;

    @ManyToOne(()=> User, (user) => user.addresses, {
        nullable: false
    })
    user: User;

    @OneToMany(() => Order, (order) => order.address)
    orders: Order[];
    
}