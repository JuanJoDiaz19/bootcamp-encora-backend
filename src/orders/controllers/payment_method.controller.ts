import { Controller } from "@nestjs/common";
import { OrdersService } from "../services/orders.service";

@Controller('payment_method')
export class PaymentMethodController{
    constructor(private readonly ordersService: OrdersService){}
}