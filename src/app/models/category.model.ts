import { Image } from "./image.model";
export class Category {
    image: Image;
    name: string;
    status: string;
    _id: string;
    constructor(obj?: any) {
        if (!obj) {
            return;
        }
        this.image = obj.image;
        this.name = obj.name;
        this.status = obj.status;
        this._id = obj._id;
    }
}