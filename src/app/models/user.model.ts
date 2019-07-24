import { Address } from "../../../../../code/native-script/farmers-hut/src/app/models/address.model";
export class User {

    name: string;
    phone: string;
    email: string;
    password: string;
    newPassword: string;
    address: Address;
    otp: string;
    tempToken: string;

    constructor(obj?: any) {
        if (!obj) {
            return;
        }
        this.name = obj.name;
        this.phone = obj.phone;
        this.email = obj.email;
        this.password = obj.password;
        this.newPassword = obj.newPassword;
        this.address = obj.address;
        this.otp = obj.otp;
        this.tempToken = obj.tempToken;
    }
}