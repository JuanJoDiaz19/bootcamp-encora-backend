import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Department } from "./Department.entity";
import { City } from "./City.entity";
import { User } from "../../auth/entities/user.entity";
import { Order } from "../../orders/entities/order.entity";

@Entity()
export class Address { 

    @ApiProperty({
        description: 'Unique identifier for the address',
        type: String,
        example: 'd9b4cfc0-3b4b-4c8a-a4f0-70d2eb09b0a7'
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        description: 'Street address',
        type: String,
        example: '123 Main St'
    })
    @Column('text', {
        nullable: false
    })
    address: string;

    @ApiProperty({
        description: 'Phone number associated with the address',
        type: String,
        example: '+1234567890'
    })
    @Column('text', {
        nullable: false
    })
    phone_number: string;

    @ApiProperty({
        description: 'ZIP code for the address',
        type: String,
        example: '12345'
    })
    @Column('text', {
        nullable: false
    })
    zip_code: string;

    @ApiProperty({
        description: 'City associated with the address',
        type: () => City
    })
    @ManyToOne(() => City, (city) => city.addresses, {
        nullable: false
    })
    city: City;

    @ApiProperty({
        description: 'User associated with the address',
        type: () => User
    })
    @ManyToOne(() => User, (user) => user.addresses, {
        nullable: false
    })
    user: User;

    @ApiProperty({
        description: 'Orders associated with the address',
        type: () => [Order],
        isArray: true
    })
    @OneToMany(() => Order, (order) => order.address, { nullable: true })
    orders: Order[];
}
