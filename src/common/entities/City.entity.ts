import { Entity, ManyToMany, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { Department } from "./Department.entity";
import { Address } from "./Address.entity";

@Entity()
export class City { 

    @PrimaryColumn('text')
    name: string;

    
    @ManyToOne(()=> Department, (department) => department.city)
    department: Department;

    @OneToMany(() => Address, (address) => address.city)
    addresses: Address[];
}