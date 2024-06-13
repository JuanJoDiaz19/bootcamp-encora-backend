import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "./role.entity";

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


    @Column('date')
    birth_date: Date;

    @ManyToOne( () => Role, (role) => role.users)
    role: Role;

}