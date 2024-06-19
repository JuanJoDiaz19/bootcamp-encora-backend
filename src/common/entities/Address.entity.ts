import { Column, Entity, ManyToMany, ManyToOne, PrimaryColumn } from "typeorm";
import { Department } from "./Department.entity";
import { City } from "./City.entity";
import { User } from "src/auth/entities/user.entity";

@Entity()
export class Address { 

    @PrimaryColumn('text', {
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

    @ManyToOne(()=> City, (city) => city.addresses)
    city: City;

    @ManyToOne(()=> User, (user) => user.addresses, {
        nullable: true
    })
    user: User;
    
}