import { Component } from "@angular/core";
import { UserService } from "./services/user.service";
import { Carousel, CarouselItem } from 'nativescript-carousel';
import { registerElement } from 'nativescript-angular/element-registry';
import * as application from "tns-core-modules/application";
import * as Toast from 'nativescript-toast';
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import * as localstorage from "nativescript-localstorage";

registerElement('Carousel', () => Carousel);
registerElement('CarouselItem', () => CarouselItem);
registerElement("PullToRefresh", () => require("nativescript-pulltorefresh").PullToRefresh);

@Component({
    selector: "ns-app",
    moduleId: module.id,
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"]
})
export class AppComponent {
    showLoading: boolean;
    tries: number;

    constructor(private userService: UserService, private router: Router) {
        this.userService.showloadingState.subscribe((state: boolean) => {
            if (state != undefined) {
                this.showLoading = state;
            }
        });

        // this.tries = 0;
        // application.android.on(application.AndroidApplication.activityBackPressedEvent, (data: application.AndroidActivityBackPressedEventData) => {
        //     data.cancel = (this.tries++ > 0) ? false : true;
        // data.cancel = true;

        // if (this.router.url == "/forgotPassword") {
        //     this.router.navigate(['./login']);
        //     return;
        // }
        // else if (this.router.url == "/setPassword") {
        //     this.router.navigate(['/forgotPassword']);
        //     return;
        // }
        // else if (this.router.url == "/profile" && localstorage.getItem("userType") == "admin") {
        //     this.router.navigate(['/homeAdmin']);
        //     return;
        // }
        // else if (this.router.url == "/profile" && localstorage.getItem("userType") == "user") {
        //     this.router.navigate(['/homeUser']);
        //     return;
        // }
        // else if (this.router.url == "/changePassword") {
        //     this.router.navigate(['/profile']);
        //     return;
        // }
        // else if (this.router.url == "/viewOrders") {
        //     this.router.navigate(['/profile']);
        //     return;
        // }
        // else if (this.router.url == "/orderHistory") {
        //     this.router.navigate(['/profile']);
        //     return;
        // }
        // else if (this.router.url == "/viewFeedback") {
        //     this.router.navigate(['/profile']);
        //     return;
        // }
        // else if (this.router.url == "/giveFeedback") {
        //     this.router.navigate(['/profile']);
        //     return;
        // }
        // else if (this.router.url == "/myOrders") {
        //     this.router.navigate(['/profile']);
        //     return;
        // }
        // else if (this.router.url == "/aboutUs") {
        //     this.router.navigate(['/profile']);
        //     return;
        // }
        // else if (this.router.url == "/myOrderDetail") {
        //     this.router.navigate(['/myOrders']);
        //     return;
        // }
        // else if (this.router.url == "/orderDetail") {
        //     this.router.navigate(['/viewOrders']);
        //     return;
        // }
        // else {
        // if (data.cancel) Toast.makeText("Press again to exit", "long").show();
        // setTimeout(() => {
        //     this.tries = 0;
        // }, 2000);
        // }
        // });
    }
}
