export class Price {
    value: string;
    currency: string;

    constructor(obj?: any) {
        if (!obj) {
            return;
        }
        this.value = obj.value;
        this.currency = obj.currency;
    }
}