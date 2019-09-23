import { Component, NgZone } from "@angular/core";
import { UserService } from "./services/user.service";
import { Carousel, CarouselItem } from 'nativescript-carousel';
import { registerElement } from 'nativescript-angular/element-registry';
import { RouterExtensions } from "nativescript-angular/router";
import { HttpClient } from "@angular/common/http";
import { HTTP } from "./services/http.service";
import { requestPermissions } from "nativescript-permissions";
import { ad } from "tns-core-modules/utils/utils"
import { Folder, File } from "tns-core-modules/file-system/file-system";
import { exit } from 'nativescript-exit';
import { initializeOnAngular } from 'nativescript-image-cache';

import * as application from "tns-core-modules/application";
import * as Toast from 'nativescript-toast';

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

    constructor(private userService: UserService, private routerExtensions: RouterExtensions, private ngZone: NgZone, private http: HttpClient) {

        initializeOnAngular();

        HTTP.http = this.http;
        this.context = ad.getApplicationContext();


        this.userService.showloadingState.subscribe((state: boolean) => {
            if (state != undefined) {
                this.showLoading = state;
            }
        });

        this.ngZone.run(() => {
            this.tries = 0;
            application.android.on(application.AndroidApplication.activityBackPressedEvent, (data: application.AndroidActivityBackPressedEventData) => {
                this.userService.activescreen.subscribe((screen: string) => {
                    if (screen == "homeUser" || screen == "homeAdmin") {
                        this.tries = 0;
                        data.cancel = (this.tries++ > 0) ? false : true;
                        if (data.cancel) {
                            Toast.makeText("Press again to exit", "short").show();
                        }
                        if (this.tries == 3) {
                            exit();
                        }
                        setTimeout(() => {
                            this.tries = 0;
                        }, 1000);
                    }
                    else {
                        data.cancel = true;
                        this.routerExtensions.back();
                    }
                });
            });
        });

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
