import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { RouterExtensions } from "nativescript-angular/router";

@Injectable()
export class NavigationService {

    public backTo: string;
    // public extras: any;

    constructor(private routerExtensions: RouterExtensions) {
        this.backTo = '';
    }

    goTo(path: string) {
        // if (extras) {
        //     this.routerExtensions.navigate([path], extras)
        // } else {
        this.routerExtensions.navigate([path])
        // this.routerExtensions.back();
        // }
    }

}