import { Component, OnInit, OnDestroy } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import * as Toast from 'nativescript-toast';
import { ActivatedRoute, NavigationExtras } from "@angular/router";
import * as localstorage from "nativescript-localstorage";
import { HttpClient } from "@angular/common/http";
import { Values } from "~/app/values/values";
import { User } from "~/app/models/user.model";
import { UserService } from "../../services/user.service";
import { NavigationService } from "~/app/services/navigation.service";

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
    constructor(private routerExtensions: RouterExtensions, private http: HttpClient, private userService: UserService, private navigationService: NavigationService) {

        this.city = "Abohar";
        this.district = "Fazilka";
        this.state = "Punjab";
        this.userName = "";
        this.phone = "";
        this.address = "";
        this.mapAddress = "";
        this.isVisibleProfile = "hidden";
    }

    ngOnInit(): void {
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
        if (localstorage.getItem("userType") == "admin") {
            this.routerExtensions.navigate(['./homeAdmin'], {
                clearHistory: true,
            });
        }
        else {
            this.routerExtensions.navigate(['/homeUser'], {
                clearHistory: true,
            })
        }
    }

    onAddressButton() {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                "city": this.city,
                "district": this.district,
                "state": this.state
            },
        };
        this.routerExtensions.navigate(['/address'], {
            queryParams: {
                "city": this.city,
                "district": this.district,
                "state": this.state
            },
            clearHistory: true,
        });
    }

    onChangePassword() {
        this.routerExtensions.navigate(['/changePassword'], {
            clearHistory: true,
        });
    }

    onOrders() {
        if (localstorage.getItem("userType") == "admin") {
            this.routerExtensions.navigate(['./viewOrders'], {
                clearHistory: true,
            });
        }
        else {
            this.routerExtensions.navigate(['./myOrders'], {
                clearHistory: true,
            });
        }
    }

    onHistory() {
        this.routerExtensions.navigate(['./orderHistory'], {
            clearHistory: true,
        });
    }

    onLogout() {
        Toast.makeText("Logout successfully!!!", "long").show();
        this.routerExtensions.navigate(['./login']);
        localstorage.removeItem('userToken');
        localstorage.removeItem('adminToken');
        localstorage.removeItem('userId');
        localstorage.removeItem('adminId');
        localstorage.removeItem("cartId");
    }

    onFeedback() {
        if (localstorage.getItem("userType") == "admin") {
            this.routerExtensions.navigate(['./viewFeedback'], {
                clearHistory: true,
            });
        }
        else {
            this.routerExtensions.navigate(['./giveFeedback'], {
                clearHistory: true,
            });
        }
    }

    onAbout() {
        if (localstorage.getItem("userType") == "admin") {
            this.routerExtensions.navigate(['./aboutUsAdmin'], {
                clearHistory: true,
            });
        }
        else {
            this.routerExtensions.navigate(['./aboutUs'], {
                clearHistory: true,
            });
        }
    }
}