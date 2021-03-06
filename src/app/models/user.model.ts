import { Address } from "./address.model";
import { DeliveryAddress } from "./delivery-address.model";
export class User {

    name: string;
    phone: string;
    email: string;
    password: string;
    newPassword: string;
    address: Address;
    otp: string;
    tempToken: string;
    regToken: string;
    deliveryAddress: DeliveryAddress;
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
        this.regToken = obj.regToken;
        this.deliveryAddress = obj.deliveryAddress;
    }
}