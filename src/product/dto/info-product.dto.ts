import { Product } from "../entities/product.entity";

export class InfoProductDto {
    id:string;
    name: string;
    description: string;
    price: number;
    image_url:string[];
    category: string;
    stock: number;

    constructor(product:Product){
        this.id = product.id;
        this.name = product.name;
        this.description = product.description;
        this.price = product.price;
        this.image_url = product.image_url;
        this.category = product.category.name;
        this.stock = product.stock.stock;
    }
}
