import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { Values } from "~/app/values/values";
import { UserService } from '../services/user.service';
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
    constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private userService: UserService) {

        this.orderedProducts = [];
        this.address = "Select address";
        this.status = "Delivered";
        this.isRenderingMessage = false;
        this.isRenderingOrders = false;

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
        this.router.navigate(['/myOrderDetail'], navigationExtras);
    }
}
