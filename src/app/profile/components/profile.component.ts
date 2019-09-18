import { Component, OnInit, OnDestroy } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { HttpClient } from "@angular/common/http";
import { Values } from "~/app/values/values";
import { User } from "~/app/models/user.model";
import { UserService } from "../../services/user.service";
import { NavigationService } from "~/app/services/navigation.service";
import { Page } from "tns-core-modules/ui/page/page";

import * as Toast from 'nativescript-toast';
import * as localstorage from "nativescript-localstorage";
import { Router } from "@angular/router";
import { NavigationEnd } from "@angular/router";


@Component({
    selector: "ns-profile",
    moduleId: module.id,
    templateUrl: "./profile.component.html",
    styleUrls: ["./profile.component.css"]
})
export class ProfileComponent implements OnInit, OnDestroy {

    city: string;
    district: string;
    state: string;
    userId: string;
    adminId: string;
    userName: string;
    phone: string;
    address: string;
    mapAddress: string;
    user: User;
    addressButton: string;
    ordersButtonText: string;
    feedbackButtonText: string;
    historyButtonText: string;
    isVisibleProfile: string;
    listener: any;

    constructor(private routerExtensions: RouterExtensions, private http: HttpClient, private userService: UserService, private navigationService: NavigationService, private page: Page, private router: Router) {
        this.page.actionBarHidden = true;
        this.city = "Abohar";
        this.district = "Fazilka";
        this.state = "Punjab";
        this.userName = "";
        this.phone = "";
        this.address = "";
        this.mapAddress = "";
        this.isVisibleProfile = "hidden";

        this.routerExtensions.router.events.subscribe((val) => {
            if (val instanceof NavigationEnd) {
                if (this.router.url == "/address") {
                    console.log("navigation end");
                };
            }
        });

        this.page.on('navigatedTo', (data) => {
            console.log("ddata:::", data.isBackNavigation);
            console.log("navigating to this page");

            if (data.isBackNavigation) {
                this.getProfileDetails()
            }
        })
    }

    ngOnInit(): void {
        this.getProfileDetails()
    }

    getProfileDetails() {
        if (localstorage.getItem("userType") == "admin") {
            this.ordersButtonText = "View Orders";
            this.historyButtonText = "Order History";
            this.feedbackButtonText = "View Feedback"
            this.navigationService.backTo = 'homeAdmin';
        }
        else {
            this.ordersButtonText = "My Orders";
            this.historyButtonText = "Order History"
            this.feedbackButtonText = "Give feedback";
            this.navigationService.backTo = 'homeUser';
        }
        // this.ngZone.run(() => {
        //     application.android.on(application.AndroidApplication.activityBackPressedEvent, (args: application.AndroidActivityBackPressedEventData) => {
        //         if (localstorage.getItem("userType") == "user") {
        //             args.cancel = true;
        //             this.routerExtensions.navigate(['/homeUser'], {
        //                 clearHistory: true,
        //             });
        //         }
        //         else {
        //             args.cancel = true;
        //             this.routerExtensions.navigate(['/homeAdmin'], {
        //                 clearHistory: true,
        //             });
        //         }
        //     });
        // });


        if (localstorage.getItem("userToken") != null && localstorage.getItem("userToken") != undefined && localstorage.getItem("userId") != null && localstorage.getItem("userId") != undefined) {
            this.userService.showLoadingState(true);
            this.userId = localstorage.getItem("userId");
            this.http
                .get(Values.BASE_URL + "users/" + this.userId)
                .subscribe((res: any) => {
                    console.log("RES:::PROF:::", res)
                    if (res != "" && res != undefined) {
                        if (res.isSuccess == true) {
                            this.userService.showLoadingState(false);
                            if (res.data.name != null && res.data.name != undefined) {
                                this.userName = res.data.name;
                            }
                            if (res.data.phone != null && res.data.phone != undefined) {
                                this.phone = res.data.phone;
                            }
                            if (res.data.address.line1 != null && res.data.address.line1 != undefined) {
                                this.address = res.data.address.line1;
                                this.addressButton = "Change address";
                            }
                            if (res.data.address.line2 != null && res.data.address.line2 != undefined) {
                                this.mapAddress = res.data.address.line2;
                                this.addressButton = "Change address";
                            }
                            else {
                                this.addressButton = "Add address";
                            }
                            this.isVisibleProfile = "visible";
                        }
                    }
                }, error => {
                    alert(error.error.error);
                });
        }
        else {
            this.adminId = localstorage.getItem("adminId");
            this.http
                .get(Values.BASE_URL + "users/" + this.adminId)
                .subscribe((res: any) => {
                    console.log("RES:::PROF:::ADD", res)
                    if (res != "" && res != undefined) {
                        if (res.isSuccess == true) {
                            this.userService.showLoadingState(false);
                            if (res.data.name != null && res.data.name != undefined) {
                                this.userName = res.data.name;
                            }
                            if (res.data.phone != null && res.data.phone != undefined) {
                                this.phone = res.data.phone;
                            }
                            if (res.data.address.line1 != null && res.data.address.line1 != undefined) {
                                this.address = res.data.address.line1;
                                this.addressButton = "Change address";
                            }
                            else {
                                this.addressButton = "Add address";
                            }
                            this.isVisibleProfile = "visible";
                        }
                    }
                }, error => {
                    this.userService.showLoadingState(false);
                    alert(error.error.error);
                });
        }

    }

    ngOnDestroy(): void {
        // this.ngZone.run(() => {
        //     application.android.off(application.AndroidApplication.activityBackPressedEvent, (args: application.AndroidActivityBackPressedEventData) => {
        //     });
        // });
    }

    onBack() {
        this.routerExtensions.back();

        // if (localstorage.getItem("userType") == "admin") {
        //     this.routerExtensions.navigate(['./homeAdmin'], {
        //         clearHistory: true,
        //     });

        //     this.routerExtensions.back();
        // }
        // else {
        //     this.routerExtensions.navigate(['/homeUser'], {
        //         clearHistory: true,
        //     })
        // }
    }

    onAddressButton() {
        // let navigationExtras: NavigationExtras = {
        //     queryParams: {
        //         "city": this.city,
        //         "district": this.district,
        //         "state": this.state
        //     },
        // };
        this.routerExtensions.navigate(['/address'], {
            queryParams: {
                "city": this.city,
                "district": this.district,
                "state": this.state
            },
        });
    }

    onChangePassword() {
        this.routerExtensions.navigate(['/changePassword']);
    }

    onOrders() {
        if (localstorage.getItem("userType") == "admin") {
            this.routerExtensions.navigate(['./viewOrders']);
        }
        else {
            this.routerExtensions.navigate(['./myOrders']);
        }
    }

    onHistory() {
        this.routerExtensions.navigate(['./orderHistory']);
    }

    onLogout() {
        Toast.makeText("Logout successfully!!!", "long").show();

        setTimeout(() => {
            this.routerExtensions.navigate(['./login']);
        }, 5)

        localstorage.removeItem('userToken');
        localstorage.removeItem('adminToken');
        localstorage.removeItem('userId');
        localstorage.removeItem('adminId');
        localstorage.removeItem("cartId");
    }

    onFeedback() {
        if (localstorage.getItem("userType") == "admin") {
            this.routerExtensions.navigate(['./viewFeedback']);
        }
        else {
            this.routerExtensions.navigate(['./giveFeedback']);
        }
    }

    onAbout() {
        if (localstorage.getItem("userType") == "admin") {
            this.routerExtensions.navigate(['./aboutUsAdmin']);
        }
        else {
            this.routerExtensions.navigate(['./aboutUs']);
        }
    }
}