import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { HttpClient } from "@angular/common/http";
import { Values } from "~/app/values/values";
import { UserService } from '../../services/user.service';
import { Order } from "~/app/models/order.model";
import { NavigationService } from "~/app/services/navigation.service";

import * as localstorage from "nativescript-localstorage";
import { Page } from "tns-core-modules/ui/page/page";


@Component({
    selector: "ns-cart",
    moduleId: module.id,
    templateUrl: "./view-orders.component.html",
    styleUrls: ["./view-orders.component.css"]
})

export class ViewOrdersComponent implements OnInit {

    orderedProducts;
    order: Order;
    status: string;
    isRenderingMessage: boolean;
    isRenderingOrders: boolean;

    orderInit = true;
    orderPageNo = 1;

    constructor(private navigationService: NavigationService, private routerExtensions: RouterExtensions, private http: HttpClient, private userService: UserService, private page: Page) {
        this.page.actionBarHidden = true;
        this.orderedProducts = [];
        this.order = new Order();
        this.isRenderingMessage = false;
        this.isRenderingOrders = false;
        this.navigationService.backTo = "profile";
    }

    ngOnInit(): void {
        this.getOrders();
    }

    getOrders() {
        if (localstorage.getItem("adminToken") != null &&
            localstorage.getItem("adminToken") != undefined &&
            localstorage.getItem("adminId") != null &&
            localstorage.getItem("adminId") != undefined) {
            this.userService.showLoadingState(true);
            this.http
                .get(Values.BASE_URL + "orders?history=false" + `&pageNo=${this.orderPageNo}&items=10`)
                .subscribe((res: any) => {
                    if (res != null && res != undefined) {
                        if (res.isSuccess == true) {
                            this.userService.showLoadingState(false);
                            if (res.data.orders.length != 0) {
                                this.isRenderingOrders = true;
                                for (var i = 0; i < res.data.orders.length; i++) {
                                    if (res.data.orders[i].status == "pending") {
                                        var status = "Pending...";
                                    }
                                    else {
                                        var status = "Confirmed";
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
                            this.orderInit = true;
                        }
                    }
                }, error => {
                    this.userService.showLoadingState(false);
                    console.log(error.error.error);
                });
        }
    }

    onLoadMoreOrderItems() {
        if (!this.orderInit) {
            this.orderPageNo = this.orderPageNo + 1;
            this.getOrders();
        }
        this.orderInit = false;
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
        this.routerExtensions.navigate(['/orderDetail'], {
            queryParams: {
                "orderId": id
            },
        });
    }
}
