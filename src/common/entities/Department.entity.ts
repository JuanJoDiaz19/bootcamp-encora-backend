import { Entity, OneToMany, PrimaryColumn } from "typeorm";
import { City } from "./City.entity";

@Entity()
export class Department { 

    @PrimaryColumn('text')
    name: string;

    @OneToMany(() => City, (city) => city.department)
    city: City[];
}