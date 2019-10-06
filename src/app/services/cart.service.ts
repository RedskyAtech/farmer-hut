import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import * as localstorage from "nativescript-localstorage";
import { Values } from '../values/values';
import { Subject } from "rxjs";

@Injectable()
export class CartService {

    private _cartCount = new Subject<string>();

    cartCountObservable = this._cartCount.asObservable();


    constructor(private http: HttpClient) {
    }

    getCartCount() {
        this.http
            .get(Values.BASE_URL + "carts/" + localstorage.getItem("cartId") + "?cartCount=true")
            .subscribe((res: any) => {
                if (res != null && res != undefined) {
                    if (res.isSuccess == true) {
                        var cartCount = res.data.cartCount;
                        // localstorage.setItem("cartCount", cartCount);
                        this.setCartCount(cartCount.toString());
                    }
                }
            }, error => {
                if (error.error.error == undefined) {
                    alert("Something went wrong!!! May be your network connection is low.");
                }
                else {
                    alert(error.error.error);
                }
            });
    }

    setCartCount(count: string) {
        this._cartCount.next(count);
    }
}