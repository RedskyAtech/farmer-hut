import { Component, OnInit, OnDestroy, NgZone } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { Values } from "~/app/values/values";
import { UserService } from '../../services/user.service';
import * as localstorage from "nativescript-localstorage";
import * as application from "tns-core-modules/application";
import { NavigationService } from "~/app/services/navigation.service";

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

    constructor(private route: ActivatedRoute, private routerExtensions: RouterExtensions, private http: HttpClient, private userService: UserService, private ngZone: NgZone, private navigationService: NavigationService) {

        this.navigationService.backTo = 'profile';
        this.orderedProducts = [];
        this.address = "Select address";
        this.status = "Delivered";
        this.isRenderingMessage = false;
        this.isRenderingOrders = false;
    }

    ngOnInit(): void {
        if (localstorage.getItem("userToken") != null &&
            localstorage.getItem("userToken") != undefined &&
            localstorage.getItem("userId") != null &&
            localstorage.getItem("userId") != undefined) {
            this.userService.showLoadingState(true);
            this.http
                .get(Values.BASE_URL + "orders?_id=" + localstorage.getItem("cartId") + "&history=false")
                .subscribe((res: any) => {
                    if (res != null && res != undefined) {
                        if (res.isSuccess == true) {
                            this.userService.showLoadingState(false);
                            if (res.data.length != 0) {
                                this.isRenderingOrders = true;
                                for (var i = 0; i < res.data.length; i++) {
                                    if (res.data[i].status == "pending") {
                                        var status = "In progress...";
                                    }
                                    else if (res.data[i].status == "confirmed") {
                                        var status = "Confirmed";
                                    }
                                    else if (res.data[i].status == "delivered") {
                                        var status = "Delivered";
                                    }
                                    else if (res.data[i].status == "rejected") {
                                        var status = "Rejected";
                                    }
                                    else {
                                        var status = "Cancelled";
                                    }
                                    this.orderedProducts.push({
                                        _id: res.data[i]._id,
                                        name: res.data[i].name,
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
