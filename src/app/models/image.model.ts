export class Image {
    url: string;
    thumbnail: string;

    constructor(obj?: any) {
        if (!obj) {
            return;
        }
        this.url = obj.url;
        this.thumbnail = obj.thumbnail;
    }
}