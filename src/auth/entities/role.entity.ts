import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Role {

    @ApiProperty({
        description: 'Role name',
        type: String,
        uniqueItems: true,
        nullable: false,
        example: 'admin'
    })
    @PrimaryColumn('text', {
        unique: true,
        nullable: false
    })
    role: string;

    @ApiProperty({
        description: 'Users associated with this role',
        type: () => [User]
    })
    @OneToMany(() => User, (user) => user.role)
    users: User[];
}
