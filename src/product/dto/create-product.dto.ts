export class CreateProductDto {
    name: string;
    description: string;
    price: number;
    image_url:string[];
    category: string;
    stock: number;
}
