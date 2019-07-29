export class Order {
    _id: string;
    status: string;
    constructor(obj?: any) {
        if (!obj) {
            return;
        }
        this._id = obj._id;
        this.status = obj.status;
    }
}