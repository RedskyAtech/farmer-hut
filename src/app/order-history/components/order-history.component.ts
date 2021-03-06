import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { HttpClient } from "@angular/common/http";
import { Values } from "~/app/values/values";
import { UserService } from '../../services/user.service';
import { NavigationService } from "~/app/services/navigation.service";
import { Page } from "tns-core-modules/ui/page/page";

import * as localstorage from "nativescript-localstorage";

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
    isRendering: boolean;

    isLoadingOrders: boolean;
    shouldLoadOrders: boolean;

    constructor(private navigationService: NavigationService, private routerExtensions: RouterExtensions, private http: HttpClient, private userService: UserService, private page: Page) {
        this.page.actionBarHidden = true;
        this.isRendering = false;
        this.userService.activeScreen('');
        this.orderedProducts = [];
        this.address = "Select address";
        this.status = "Delivered";
        this.isRenderingHistory = false;
        this.isRenderingMessage = false;

        this.shouldLoadOrders = false;
        this.isLoadingOrders = false;

        this.navigationService.backTo = "profile";

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

        this.page.on('navigatedTo', (data) => {
            console.log("ddata:::", data.isBackNavigation);
            console.log("navigating to this page:::", data.context);
            if (data.isBackNavigation) {
                this.orderPageNo = 1;
                this.userService.activeScreen("");
                this.viewOrderHistory();
            }
        })
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.isRendering = true;
        }, 50);
    }

    onBack() {
        this.routerExtensions.back();
    }

    onViewDetail(id: string) {
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

    onOrderItemLoading(args: any) {
        console.log('ProductItemLoaded:::', args.index)
        var criteria = (this.orderPageNo * 10) - 5;
        if (this.shouldLoadOrders) {
            if (args.index == criteria) {
                this.orderPageNo = this.orderPageNo + 1;
                this.viewOrderHistory();
            }
        }
        this.shouldLoadOrders = true;
    }

    viewOrderHistory() {
        if (localstorage.getItem("userType") != null && localstorage.getItem("userType") != undefined) {
            if (localstorage.getItem("userType") == "admin") {
                this.isLoadingOrders = true;
                this.userService.showLoadingState(true);
                this.http
                    .get(Values.BASE_URL + "orders?history=true" + `&pageNo=${this.orderPageNo}&items=10`)
                    .subscribe((res: any) => {
                        if (res != null && res != undefined) {
                            if (res.isSuccess == true) {
                                this.userService.showLoadingState(false);
                                if (res.data.orders.length != 0) {
                                    this.isRenderingHistory = true;
                                    this.orderedProducts = [];
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
                                            orderId: res.data.orders[i].orderId,
                                            name: res.data.orders[i].name,
                                            status: status
                                        })
                                    }
                                }
                                else {
                                    this.isRenderingMessage = true;
                                }
                                setTimeout(() => {
                                    this.isLoadingOrders = false;
                                }, 5)
                                this.shouldLoadOrders = false;
                                this.orderInit = true;
                            }
                        }
                    }, error => {
                        setTimeout(() => {
                            this.isLoadingOrders = false;
                        }, 5)
                        this.shouldLoadOrders = false;
                        this.userService.showLoadingState(false);
                        console.log(error.error.error);
                    });
            }
            else {
                this.isLoadingOrders = true;
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
                                    this.orderedProducts = [];
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
                                            orderId: res.data.orders[i].orderId,
                                            name: res.data.orders[i].name,
                                            status: status
                                        })
                                    }
                                }
                                else {
                                    this.isRenderingMessage = true;
                                }
                                setTimeout(() => {
                                    this.isLoadingOrders = false;
                                }, 5)
                                this.shouldLoadOrders = false;
                                this.orderInit = true;
                            }
                        }
                    }, error => {
                        setTimeout(() => {
                            this.isLoadingOrders = false;
                        }, 5)
                        this.shouldLoadOrders = false;
                        this.userService.showLoadingState(false);
                        console.log(error.error.error);
                    });
            }
        }
    }
}
