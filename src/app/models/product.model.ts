import { Image } from "./image.model";
import { Heading } from "./heading.model";
import { Dimensions } from "./dimensions.model";
import { Price } from "./price.model";
import { Category } from "./category.model";
export class Product {
    _id: string;
    name: string;
    brand: string;
    status: string;
    isAdded: string;
    image: Image;
    heading: Heading;
    dimensions: Array<Dimensions>;
    price: Price;
    quantity: string;
    category: Category;
    isSimilarProduct: boolean;
    constructor(obj?: any) {
        if (!obj) {
            return;
        }
        this._id = obj._id;
        this.name = obj.name;
        this.brand = obj.brand;
        this.status = obj.status;
        this.isAdded = obj.isAdded;
        this.image = obj.image;
        this.heading = obj.heading;
        this.dimensions = obj.dimensions;
        this.price = obj.price;
        this.quantity = obj.quantity;
        this.category = obj.category;
        this.isSimilarProduct = obj.isSimilarProduct;
    }
}