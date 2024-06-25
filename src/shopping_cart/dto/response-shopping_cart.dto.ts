import { ShoppingCartStatus } from "../entities/shopping_cart_status.entity";
import { ShoppingCartItemResponseDto } from "./response-shopping_cart_item.dto";

export class ShoppingCartResponseDto {
    id: string;
    items: ShoppingCartItemResponseDto[];
    sub_total: number;
    status: ShoppingCartStatus;
    userId: string;
}