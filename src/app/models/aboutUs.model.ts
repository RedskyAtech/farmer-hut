export class AboutUs {
    description: string;
    constructor(obj?: any) {
        if (!obj) {
            return;
        }
        this.description = obj.description;
    }
}