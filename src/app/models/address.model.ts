export class Address {

    line1: string;
    line2: string;

    constructor(obj?: any) {
        if (!obj) {
            return;
        }
        this.line1 = obj.line1;
        this.line2 = obj.line2;
    }
}