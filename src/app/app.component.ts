import { Component, NgZone } from "@angular/core";
import { UserService } from "./services/user.service";
import { Carousel, CarouselItem } from 'nativescript-carousel';
import { registerElement } from 'nativescript-angular/element-registry';
import { RouterExtensions } from "nativescript-angular/router";
import { NavigationService } from "./services/navigation.service";
import { HttpClient } from "@angular/common/http";
import { HTTP } from "./services/http.service";
import * as application from "tns-core-modules/application";
import * as Toast from 'nativescript-toast';
import { requestPermissions } from "nativescript-permissions";
import { ad } from "tns-core-modules/utils/utils"
import { BackgroundService } from "./services/background.service"
import { BackgroundHttpService } from "./services/background.http.service";
import { Folder, File } from "tns-core-modules/file-system/file-system";
import { Router } from "@angular/router";
import { exit } from 'nativescript-exit';

registerElement('Carousel', () => Carousel);
registerElement('CarouselItem', () => CarouselItem);
registerElement("PullToRefresh", () => require("nativescript-pulltorefresh").PullToRefresh);
registerElement("MapView", () => require("nativescript-google-maps-sdk").MapView);

declare var android: any;



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
    context: any;
    file: File;
    folder: Folder;

    constructor(private userService: UserService, private routerExtensions: RouterExtensions, private router: Router, private ngZone: NgZone, private navigationService: NavigationService, private http: HttpClient, private backgroundHttpService: BackgroundHttpService) {

        HTTP.http = this.http;
        this.context = ad.getApplicationContext();


        this.userService.showloadingState.subscribe((state: boolean) => {
            if (state != undefined) {
                this.showLoading = state;
            }
        });

        this.ngZone.run(() => {
            application.android.on(application.AndroidApplication.activityBackPressedEvent, (data: application.AndroidActivityBackPressedEventData) => {
                this.userService.activescreen.subscribe((screen: string) => {
                    if (screen == "homeUser" || screen == "homeAdmin") {
                        this.tries = 0;
                        data.cancel = (this.tries++ > 0) ? false : true;
                        if (data.cancel) {
                            Toast.makeText("Press again to exit", "short").show();
                        }
                        setTimeout(() => {
                            this.tries = 0;
                        }, 1000);
                        if (this.tries == 2) {
                            exit();
                        }
                    }
                    else {
                        data.cancel = true;
                        this.routerExtensions.back();
                    }
                });
                // if (this.navigationService.backTo != undefined) {
                //     data.cancel = true;
                //     this.navigationService.goTo(this.navigationService.backTo);
                //     // this.routerExtensions.back();
                // }
                // else {
                //     data.cancel = (this.tries++ > 0) ? false : true;
                //     if (data.cancel) Toast.makeText("Press again to exit", "long").show();
                //     setTimeout(() => {
                //         this.tries = 0;
                //     }, 2000);
                // }
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
            // application.android.off(this.listener);
        });

        // if (application.android) {
        //     GMSServices.provideAPIKey('AIzaSyAtRVvG3Be3xXiZFR7xp-K-9hy4nZ4hMFs');
        // }
        var permissions: Array<any> = new Array<any>();
        permissions.push(android.Manifest.permission.READ_EXTERNAL_STORAGE);
        permissions.push(android.Manifest.permission.WRITE_EXTERNAL_STORAGE);
        permissions.push(android.Manifest.permission.ACCESS_FINE_LOCATION);


        requestPermissions(permissions, 'Application needs location access for its functioning.').then(() => {
            console.log('Permission Granted');
            this.folder = Folder.fromPath('/storage/emulated/0/farmersHut')
            this.file = this.folder.getFile('FarmersHut.jpg')
        })
    }
}
