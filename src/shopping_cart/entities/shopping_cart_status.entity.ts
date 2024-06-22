import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ShoppingCartStatus {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    status: string;
}
