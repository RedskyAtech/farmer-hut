import { Component, OnInit, OnDestroy, NgZone } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { Values } from "~/app/values/values";
import { UserService } from '../../services/user.service';
import * as localstorage from "nativescript-localstorage";
import { NavigationService } from "~/app/services/navigation.service";
import { Page } from "tns-core-modules/ui/page/page";

@Component({
    selector: "ns-myOrderDetail",
    moduleId: module.id,
    templateUrl: "./my-orders.component.html",
    styleUrls: ["./my-orders.component.css"]
})

export class MyOrdersComponent implements OnInit, OnDestroy {

    orderedProducts;
    address: string;
    status: string;
    isRenderingMessage: boolean;
    isRenderingOrders: boolean;
    listener: any;
    orderInit = true;
    orderPageNo = 1;
    isRendering: boolean;
    // isLoading: boolean;

    constructor(private route: ActivatedRoute, private routerExtensions: RouterExtensions, private http: HttpClient, private userService: UserService, private ngZone: NgZone, private navigationService: NavigationService, private page: Page) {
        this.page.actionBarHidden = true;
        this.isRendering = false;
        this.navigationService.backTo = 'profile';
        this.orderedProducts = [];
        this.address = "Select address";
        this.status = "Delivered";
        this.isRenderingMessage = false;
        this.isRenderingOrders = false;
        this.getOrders();
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.isRendering = true;
            // this.isLoading = false;
        }, 50);
    }

    getOrders() {
        if (localstorage.getItem("userToken") != null &&
            localstorage.getItem("userToken") != undefined &&
            localstorage.getItem("userId") != null &&
            localstorage.getItem("userId") != undefined) {
            this.userService.showLoadingState(true);
            // this.isLoading = true;
            this.http
                .get(Values.BASE_URL + "orders?_id=" + localstorage.getItem("cartId") + "&history=false" + `&pageNo=${this.orderPageNo}&items=10`)
                .subscribe((res: any) => {
                    if (res != null && res != undefined) {
                        if (res.isSuccess == true) {
                            this.userService.showLoadingState(false);
                            // this.isLoading = false;
                            if (res.data.orders.length != 0) {
                                this.isRenderingOrders = true;
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
                    // this.isLoading = false;
                    this.userService.showLoadingState(false);
                    if (error.error.error == undefined) {
                        // this.errorMessage = "May be your network connection is low.";
                        // this.warningDialog.show();
                        alert("Something went wrong!!! May be your network connection is low.");
                    }
                    else {
                        // this.errorMessage = error.error.error;
                        // this.warningDialog.show();
                        alert(error.error.error);
                    }
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

    ngOnDestroy(): void {
        // this.ngZone.run(() => {
        //     application.android.off(application.AndroidApplication.activityBackPressedEvent, (args: application.AndroidActivityBackPressedEventData) => {
        //         args.cancel = true;
        //     });
        // });
    }

    onBack() {
        // this.routerExtensions.navigate(['/profile'], {
        //     clearHistory: true,
        // });
        this.routerExtensions.back();
    }

    onViewDetail(id: string) {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                "orderId": id
            },
        };
        this.routerExtensions.navigate(['/myOrderDetail'], {
            queryParams: {
                "orderId": id
            }
        });
    }
}
