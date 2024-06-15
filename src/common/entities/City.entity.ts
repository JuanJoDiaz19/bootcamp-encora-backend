import { Entity, ManyToMany, ManyToOne, PrimaryColumn } from "typeorm";
import { Department } from "./Department.entity";

@Entity()
export class City { 

    @PrimaryColumn('text')
    name: string;

    
    @ManyToOne(()=> Department, (department) => department.city)
    department: Department;
}