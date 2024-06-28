import { ApiProperty } from '@nestjs/swagger';
import { Entity, OneToMany, PrimaryColumn } from "typeorm";
import { City } from "./City.entity";

@Entity()
export class Department { 

    @ApiProperty({
        description: 'Name of the department',
        type: String,
        example: 'California'
    })
    @PrimaryColumn('text')
    name: string;

    @ApiProperty({
        description: 'List of cities in the department',
        type: () => [City],
        isArray: true
    })
    @OneToMany(() => City, (city) => city.department)
    city: City[];
}
