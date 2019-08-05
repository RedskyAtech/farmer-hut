import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import { Product } from "../../models/product";
import * as localstorage from "nativescript-localstorage";
import { HttpClient } from "@angular/common/http";
import { Values } from "~/app/values/values";
import { UserService } from '../../services/user.service';
import { Order } from "~/app/models/order.model";

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

    constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private userService: UserService) {
        this.orderedProducts = [];
        this.order = new Order();
        this.isRenderingMessage = false;
        this.isRenderingOrders = false;

        if (localstorage.getItem("adminToken") != null &&
            localstorage.getItem("adminToken") != undefined &&
            localstorage.getItem("adminId") != null &&
            localstorage.getItem("adminId") != undefined) {
            this.userService.showLoadingState(true);
            this.http
                .get(Values.BASE_URL + "orders?history=false")
                .subscribe((res: any) => {
                    if (res != null && res != undefined) {
                        if (res.isSuccess == true) {
                            this.userService.showLoadingState(false);
                            if (res.data.length != 0) {
                                this.isRenderingOrders = true;
                                for (var i = 0; i < res.data.length; i++) {
                                    if (res.data[i].status == "pending") {
                                        var status = "Pending...";
                                    }
                                    else {
                                        var status = "Confirmed";
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
        this.router.navigate(['/orderDetail'], navigationExtras);
    }
}
