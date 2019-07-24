export class Heading {
    title: string;
    description: string;

    constructor(obj?: any) {
        if (!obj) {
            return;
        }
        this.title = obj.title;
        this.description = obj.description;
    }
}