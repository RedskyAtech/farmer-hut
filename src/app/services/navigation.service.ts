import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { RouterExtensions } from "nativescript-angular/router";

@Injectable()
export class NavigationService {

    public backTo: string;

    constructor(private routerExtensions: RouterExtensions) {
        this.backTo = '';
    }

    goTo(path: string) {
        this.routerExtensions.navigate([path])
    }

}