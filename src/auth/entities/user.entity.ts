import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "./role.entity";
import { Address } from "src/common/entities/Address.entity";
import { Order } from "src/orders/entities/order.entity";

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

    @ManyToOne( () => Role, (role) => role.users)
    role: Role;

    @OneToMany(() => Address, (address) => address.user)
    addresses: Address[];

    @OneToMany(() => Order, (order) => order.user)
    orders: Order[];

}