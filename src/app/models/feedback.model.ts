export class Feedback {

    message: string;
    userId: string;
    constructor(obj?: any) {
        if (!obj) {
            return;
        }
        this.message = obj.message;
        this.userId = obj.userId;
        
    }
}