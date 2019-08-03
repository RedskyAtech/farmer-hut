import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { Values } from "~/app/values/values";
import { UserService } from '../services/user.service';
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

    constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private userService: UserService) {
        this.orderedProducts = [];
        this.address = "Select address";
        this.status = "Delivered";
        this.isRenderingHistory = false;
        this.isRenderingMessage = false;

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
        this.router.navigate(['/profile']);
    }

    onViewDetail(id: string) {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                "orderId": id
            },
        };
        if (this.userType == "admin") {
            this.router.navigate(['/orderDetail'], navigationExtras);
        }
        else {
            this.router.navigate(['/myOrderDetail'], navigationExtras);
        }
    }

    viewOrderHistory() {
        if (localstorage.getItem("userType") != null && localstorage.getItem("userType") != undefined) {
            if (localstorage.getItem("userType") == "admin") {
                this.userService.showLoadingState(true);
                this.http
                    .get(Values.BASE_URL + "orders?history=true")
                    .subscribe((res: any) => {
                        if (res != null && res != undefined) {
                            if (res.isSuccess == true) {
                                this.userService.showLoadingState(false);
                                if (res.data.length != 0) {
                                    this.isRenderingHistory = true;
                                    for (var i = 0; i < res.data.length; i++) {
                                        if (res.data[i].status == "delivered") {
                                            var status = "Delivered";
                                        }
                                        if (res.data[i].status == "rejected") {
                                            var status = "Rejected";
                                        }
                                        if (res.data[i].status == "cancelled") {
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
            else {
                this.userService.showLoadingState(true);
                this.http
                    .get(Values.BASE_URL + "orders?_id=" + localstorage.getItem("cartId") + "&history=true")
                    .subscribe((res: any) => {
                        if (res != null && res != undefined) {
                            if (res.isSuccess == true) {
                                this.userService.showLoadingState(false);
                                if (res.data.length != 0) {
                                    this.isRenderingHistory = true;
                                    for (var i = 0; i < res.data.length; i++) {
                                        if (res.data[i].status == "delivered") {
                                            var status = "Delivered";
                                        }
                                        if (res.data[i].status == "rejected") {
                                            var status = "Rejected";
                                        }
                                        if (res.data[i].status == "cancelled") {
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
    }
}
