export class Location {

    latitude: string;
    longitude: string;

    constructor(obj?: any) {
        if (!obj) {
            return;
        }
        this.latitude = obj.latitude;
        this.longitude = obj.longitude;
    }
}