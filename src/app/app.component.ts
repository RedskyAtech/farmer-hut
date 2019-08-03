import { Component } from "@angular/core";
import { UserService } from "./services/user.service";
import { Carousel, CarouselItem } from 'nativescript-carousel';
import { registerElement } from 'nativescript-angular/element-registry';
import * as application from "tns-core-modules/application";
import * as Toast from 'nativescript-toast';

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

    constructor(private userService: UserService) {
        this.userService.showloadingState.subscribe((state: boolean) => {
            if (state != undefined) {
                this.showLoading = state;
            }
        });

        this.tries = 0;
        application.android.on(application.AndroidApplication.activityBackPressedEvent, (data: application.AndroidActivityBackPressedEventData) => {
            data.cancel = (this.tries++ > 0) ? false : true;
            // data.cancel = true;
            // if (this.router.url == "/profile") {
            // this.router.navigate(['./homeUser']);
            // }
            if (data.cancel) Toast.makeText("Press again to exit", "long").show();
            setTimeout(() => {
                this.tries = 0;
            }, 2000);
        });
    }
}
