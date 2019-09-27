import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { HttpClient } from "@angular/common/http";
import { Values } from "~/app/values/values";
import { UserService } from '../../services/user.service';
import { NavigationService } from "~/app/services/navigation.service";
import { Page } from "tns-core-modules/ui/page/page";

import * as localstorage from "nativescript-localstorage";

@Component({
    selector: "ns-myOrderDetail",
    moduleId: module.id,
    templateUrl: "./my-orders.component.html",
    styleUrls: ["./my-orders.component.css"]
})

export class MyOrdersComponent implements OnInit {

    orderedProducts;
    address: string;
    status: string;
    isRenderingMessage: boolean;
    isRenderingOrders: boolean;
    listener: any;
    orderInit = true;
    orderPageNo = 1;
    isRendering: boolean;

    isLoadingOrders: boolean;
    shouldLoadOrders: boolean;

    constructor(private routerExtensions: RouterExtensions, private http: HttpClient, private userService: UserService, private navigationService: NavigationService, private page: Page) {
        this.page.actionBarHidden = true;
        this.isRendering = false;
        this.userService.activeScreen('');
        this.navigationService.backTo = 'profile';
        this.orderedProducts = [];
        this.address = "Select address";
        this.status = "Delivered";
        this.isRenderingMessage = false;
        this.isRenderingOrders = false;

        this.shouldLoadOrders = false;
        this.isLoadingOrders = false;

        this.page.on('navigatedTo', (data) => {
            console.log("ddata:::", data.isBackNavigation);
            console.log("navigating to this page:::", data.context);
            if (data.isBackNavigation) {
                this.orderPageNo = 1;
                this.userService.activeScreen("");
                this.getOrders();
            }
        })
        this.getOrders();
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.isRendering = true;
        }, 50);
    }

    onOrderItemLoading(args: any) {
        console.log('ProductItemLoaded:::', args.index)
        var criteria = (this.orderPageNo * 10) - 5;
        if (this.shouldLoadOrders) {
            if (args.index == criteria) {
                this.orderPageNo = this.orderPageNo + 1;
                this.getOrders();
            }
        }
        this.shouldLoadOrders = true;
    }

    getOrders() {
        if (localstorage.getItem("userToken") != null &&
            localstorage.getItem("userToken") != undefined &&
            localstorage.getItem("userId") != null &&
            localstorage.getItem("userId") != undefined) {
            this.isLoadingOrders = true;
            this.userService.showLoadingState(true);
            this.http
                .get(Values.BASE_URL + "orders?_id=" + localstorage.getItem("cartId") + "&history=false" + `&pageNo=${this.orderPageNo}&items=10`)
                .subscribe((res: any) => {
                    if (res != null && res != undefined) {
                        if (res.isSuccess == true) {
                            this.userService.showLoadingState(false);
                            if (res.data.orders.length != 0) {
                                this.isRenderingOrders = true;
                                this.orderedProducts = [];
                                for (var i = 0; i < res.data.orders.length; i++) {
                                    if (res.data.orders[i].status == "pending") {
                                        var status = "In progress...";
                                    }
                                    else if (res.data.orders[i].status == "confirmed") {
                                        var status = "Confirmed";
                                    }
                                    else if (res.data.orders[i].status == "delivered") {
                                        var status = "Delivered";
                                    }
                                    else if (res.data.orders[i].status == "rejected") {
                                        var status = "Rejected";
                                    }
                                    else {
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
                            this.orderInit = true;
                            setTimeout(() => {
                                this.isLoadingOrders = false;
                            }, 5)
                            this.shouldLoadOrders = false;
                        }
                    }
                }, error => {
                    setTimeout(() => {
                        this.isLoadingOrders = false;
                    }, 5)
                    this.userService.showLoadingState(false);
                    if (error.error.error == undefined) {
                        alert("Something went wrong!!! May be your network connection is low.");
                    }
                    else {
                        alert(error.error.error);
                    }
                });
        }
    }

    onBack() {
        this.routerExtensions.back();
    }

    onViewDetail(id: string) {
        this.routerExtensions.navigate(['/myOrderDetail'], {
            queryParams: {
                "orderId": id
            }
        });
    }
}
