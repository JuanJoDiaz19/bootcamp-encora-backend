import { ApiProperty } from '@nestjs/swagger';
import { Entity, ManyToMany, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { Department } from "./Department.entity";
import { Address } from "./Address.entity";

@Entity()
export class City { 

    @ApiProperty({
        description: 'Name of the city',
        type: String,
        example: 'New York'
    })
    @PrimaryColumn('text')
    name: string;

    @ApiProperty({
        description: 'Department to which the city belongs',
        type: () => Department
    })
    @ManyToOne(() => Department, (department) => department.city)
    department: Department;

    @ApiProperty({
        description: 'List of addresses located in the city',
        type: () => [Address],
        isArray: true
    })
    @OneToMany(() => Address, (address) => address.city)
    addresses: Address[];
}
