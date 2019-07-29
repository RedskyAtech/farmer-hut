import { Order } from "./order.model";

export class MyOrders {
    status: string;
    order: Order;
    constructor(obj?: any) {
        if (!obj) {
            return;
        }
        this.status = obj.status;
        this.order = obj.order;
    }
}