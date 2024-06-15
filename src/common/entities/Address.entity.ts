import { Column, Entity, ManyToMany, ManyToOne, PrimaryColumn } from "typeorm";
import { Department } from "./Department.entity";

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
    
}