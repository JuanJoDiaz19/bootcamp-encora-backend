import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Role { 

    @PrimaryColumn('text',{
        unique:true,
        nullable:false
    })
    role: string;

    @OneToMany(()=> User, (user)=> user.role)
    users: User[];

}