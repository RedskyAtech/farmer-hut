export class Product {

    id: string;
    image: string;
    name: string;
    brandName: string;
    fullName: string;
    detailHeading: string;
    detailDescription: string;
    quantity: string;
    weight: string;
    price: string;
    cartStatus: boolean;
    orderByName: string;
    orderByAddress: string;
    orderByPhone: string;

    constructor(obj?: any) {
        if (!obj) {
            return;
        }

        this.image = obj.image;
        this.brandName = obj.brandName;
        this.name = obj.name;
        this.fullName = obj.fullName;
        this.detailHeading = obj.detailHeading;
        this.detailDescription = obj.detailDescription;
        this.quantity = obj.quantity;
        this.weight = obj.weight;
        this.price = obj.price;
        this.cartStatus = obj.cartStatus;
    }
}