import { Component, NgZone } from "@angular/core";
import { UserService } from "./services/user.service";
import { Carousel, CarouselItem } from 'nativescript-carousel';
import { registerElement } from 'nativescript-angular/element-registry';
import * as application from "tns-core-modules/application";
import * as Toast from 'nativescript-toast';
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import * as localstorage from "nativescript-localstorage";
import { RouterExtensions } from "nativescript-angular/router";
import { NavigationService } from "./services/navigation.service";

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
    listener: any;

    constructor(private userService: UserService, private router: Router, private routerExtensions: RouterExtensions, private ngZone: NgZone, private navigationService: NavigationService) {
        this.userService.showloadingState.subscribe((state: boolean) => {
            if (state != undefined) {
                this.showLoading = state;
            }
        });
        this.ngZone.run(() => {
            this.tries = 0;
            application.android.on(application.AndroidApplication.activityBackPressedEvent, (data: application.AndroidActivityBackPressedEventData) => {
                if (this.navigationService.backTo != undefined) {
                    data.cancel = true;
                    this.navigationService.goTo(this.navigationService.backTo);
                }
                else {
                    data.cancel = (this.tries++ > 0) ? false : true;
                    if (data.cancel) Toast.makeText("Press again to exit", "long").show();
                    setTimeout(() => {
                        this.tries = 0;
                    }, 2000);
                }
                //     if (this.router.url == "/profile" && localstorage.getItem("userType") == "admin") {
                //         this.router.navigate(['/homeAdmin']);
                //         return;
                //     }
                //     else if (this.router.url == "/profile" && localstorage.getItem("userType") == "user") {
                //         this.router.navigate(['/homeUser']);
                //         return;
                //     }
                // }
            });
        });
    }
}
