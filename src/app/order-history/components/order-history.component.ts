import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { NavigationExtras, ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { Values } from "~/app/values/values";
import { UserService } from '../../services/user.service';
import { NavigationService } from "~/app/services/navigation.service";

import * as localstorage from "nativescript-localstorage";
import * as application from "tns-core-modules/application";
import { Page } from "tns-core-modules/ui/page/page";

@Component({
    selector: "ns-orderHistory",
    moduleId: module.id,
    templateUrl: "./order-history.component.html",
    styleUrls: ["./order-history.component.css"]
})

export class OrderHistoryComponent implements OnInit {

    orderedProducts;
    address: string;
    status: string;
    userType: string;
    isRenderingMessage: boolean;
    isRenderingHistory: boolean;
    orderInit = true;
    orderPageNo = 1;

    constructor(private navigationService: NavigationService, private routerExtensions: RouterExtensions, private http: HttpClient, private userService: UserService, private page: Page) {
        this.page.actionBarHidden = true;
        this.orderedProducts = [];
        this.address = "Select address";
        this.status = "Delivered";
        this.isRenderingHistory = false;
        this.isRenderingMessage = false;
        this.navigationService.backTo = "profile";

        application.android.on(application.AndroidApplication.activityBackPressedEvent, (data: application.AndroidActivityBackPressedEventData) => {
            this.routerExtensions.navigate(['/profile'], {
                clearHistory: true,
            });
            return;
        });

        if (localstorage.getItem("userType") != null) {
            this.userType = localstorage.getItem("userType");
        }

        if (localstorage.getItem("userToken") != null &&
            localstorage.getItem("userToken") != undefined &&
            localstorage.getItem("userId") != null &&
            localstorage.getItem("userId") != undefined) {
            this.viewOrderHistory();
        }
        if (localstorage.getItem("adminToken") != null &&
            localstorage.getItem("adminToken") != undefined &&
            localstorage.getItem("adminId") != null &&
            localstorage.getItem("adminId") != undefined) {
            this.viewOrderHistory();
        }
    }

    ngOnInit(): void {
    }

    onBack() {
        // this.routerExtensions.navigate(['/profile'], {
        //     clearHistory: true,
        // });

        this.routerExtensions.back();
    }

    onViewDetail(id: string) {
        // let navigationExtras: NavigationExtras = {
        //     queryParams: {
        //         "orderId": id
        //     },
        // };
        if (this.userType == "admin") {
            this.routerExtensions.navigate(['/orderDetail'], {
                queryParams: {
                    "orderId": id
                },
            });
        }
        else {
            this.routerExtensions.navigate(['/myOrderDetail'], {
                queryParams: {
                    "orderId": id
                },
            });
        }
    }

    viewOrderHistory() {
        if (localstorage.getItem("userType") != null && localstorage.getItem("userType") != undefined) {
            if (localstorage.getItem("userType") == "admin") {
                this.userService.showLoadingState(true);
                this.http
                    .get(Values.BASE_URL + "orders?history=true" + `&pageNo=${this.orderPageNo}&items=10`)
                    .subscribe((res: any) => {
                        console.log("RES:::ORDERHISTORY:::ADMIN", res);
                        if (res != null && res != undefined) {
                            if (res.isSuccess == true) {
                                this.userService.showLoadingState(false);
                                if (res.data.orders.length != 0) {
                                    this.isRenderingHistory = true;
                                    for (var i = 0; i < res.data.orders.length; i++) {
                                        if (res.data.orders[i].status == "delivered") {
                                            var status = "Delivered";
                                        }
                                        if (res.data.orders[i].status == "rejected") {
                                            var status = "Rejected";
                                        }
                                        if (res.data.orders[i].status == "cancelled") {
                                            var status = "Cancelled";
                                        }
                                        this.orderedProducts.push({
                                            _id: res.data.orders[i]._id,
                                            name: res.data.orders[i].name,
                                            status: status
                                        })
                                    }
                                }
                                else {
                                    this.isRenderingMessage = true;
                                }
                            }
                        }
                    }, error => {
                        this.userService.showLoadingState(false);
                        console.log(error.error.error);
                    });
            }
            else {
                this.userService.showLoadingState(true);
                this.http
                    .get(Values.BASE_URL + "orders?_id=" + localstorage.getItem("cartId") + "&history=true")
                    .subscribe((res: any) => {
                        console.log("RES:::ORDERHISTORY:::USER", res);
                        if (res != null && res != undefined) {
                            if (res.isSuccess == true) {
                                this.userService.showLoadingState(false);
                                if (res.data.orders.length != 0) {
                                    this.isRenderingHistory = true;
                                    for (var i = 0; i < res.data.orders.length; i++) {
                                        if (res.data.orders[i].status == "delivered") {
                                            var status = "Delivered";
                                        }
                                        if (res.data.orders[i].status == "rejected") {
                                            var status = "Rejected";
                                        }
                                        if (res.data.orders[i].status == "cancelled") {
                                            var status = "Cancelled";
                                        }
                                        this.orderedProducts.push({
                                            _id: res.data.orders[i]._id,
                                            name: res.data.orders[i].name,
                                            status: status
                                        })
                                    }
                                }
                                else {
                                    this.isRenderingMessage = true;
                                }
                            }
                        }
                    }, error => {
                        this.userService.showLoadingState(false);
                        console.log(error.error.error);
                    });
            }
        }
    }

    onLoadMoreOrderItems() {
        if (!this.orderInit) {
            this.orderPageNo = this.orderPageNo + 1;
            this.viewOrderHistory();
        }
        this.orderInit = false;
    }
}
