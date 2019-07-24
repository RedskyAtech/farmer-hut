export class Dimensions {
    value: string;
    unit: string;

    constructor(obj?: any) {
        if (!obj) {
            return;
        }
        this.value = obj.value;
        this.unit = obj.unit;
    }
}