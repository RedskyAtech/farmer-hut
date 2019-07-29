import { Product } from "./product.model";
import { Order } from "./order.model";
export class Cart {
    product: Product;
    order: Order;
    status: string;
    constructor(obj?: any) {
        if (!obj) {
            return;
        }
        this.product = obj.product;
        this.order = obj.order;
        this.status = obj.status;
    }
}