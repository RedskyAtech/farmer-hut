import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import * as Toast from 'nativescript-toast';
import * as application from "tns-core-modules/application";
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
import * as localstorage from "nativescript-localstorage";
import { HttpClient } from "@angular/common/http";
import { Values } from "~/app/values/values";
import { User } from "~/app/models/user.model";
import { UserService } from "../services/user.service";

@Component({
    selector: "ns-profile",
    moduleId: module.id,
    templateUrl: "./profile.component.html",
    styleUrls: ["./profile.component.css"]
})
export class ProfileComponent implements OnInit {

    city: string;
    district: string;
    state: string;
    userId: string;
    adminId: string;
    userName: string;
    phone: string;
    address: string;
    user: User;
    addressButton: string;
    ordersButtonText: string;
    feedbackButtonText: string;
    historyButtonText: string;

    constructor(private route: ActivatedRoute, private routerExtensions: RouterExtensions, private router: Router, private http: HttpClient, private userService: UserService) {
        this.city = "Abohar";
        this.district = "Fazilka";
        this.state = "Punjab";
        this.userName = "";
        this.phone = "";
        this.address = "";

        if (localstorage.getItem("userType") == "admin") {
            this.ordersButtonText = "View Orders";
            this.historyButtonText = "Order History";
            this.feedbackButtonText = "View Feedback"
        }
        else {
            this.ordersButtonText = "My Orders";
            this.historyButtonText = "Order History"
            this.feedbackButtonText = "Give feedback";
        }

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
                            else {
                                this.addressButton = "Add address";
                            }
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

    ngOnInit(): void {

    }

    onBack() {
        if (localstorage.getItem("userType") == "admin") {
            this.routerExtensions.navigate(['./homeAdmin']);
        }
        else {
            this.routerExtensions.navigate(['/homeUser'])
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
        this.router.navigate(['/address'], navigationExtras);
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
        this.routerExtensions.navigate(['./login']);
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
        this.routerExtensions.navigate(['./aboutUs']);
    }
}