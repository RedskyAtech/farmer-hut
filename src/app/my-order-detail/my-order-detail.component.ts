import { Component, OnInit, ViewChild } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import { ModalComponent } from "~/app/modals/modal.component";
import { UserService } from "~/app/services/user.service";
import { HttpClient } from "@angular/common/http";
import { Values } from "~/app/values/values";
import { Order } from "../models/order.model";
import * as Toast from 'nativescript-toast';

@Component({
    selector: "ns-myOrderDetail",
    moduleId: module.id,
    templateUrl: "./my-order-detail.component.html",
    styleUrls: ["./my-order-detail.component.css"]
})

export class MyOrderDetailComponent implements OnInit {

    @ViewChild('cancelOrderDialog') cancelOrderDialog: ModalComponent;

    orderedProducts = [];
    userName: string;
    phoneNumber: string;
    address: string;
    totalAmount: string;
    orderId: string;
    userLatitude: string;
    userLongitude: string;
    orderStatus: string;
    order: Order;
    cancelButtonText: string;

    constructor(private route: ActivatedRoute, private router: Router, private userService: UserService, private http: HttpClient) {
        this.userName = "";
        this.phoneNumber = "";
        this.address = "";
        this.totalAmount = "";
        this.order = new Order();
        this.cancelButtonText = "Cancel your order";

        this.route.queryParams.subscribe(params => {
            if (params["orderId"] != "") {
                this.orderId = params["orderId"];
            }
        });
        if (this.orderId != null && this.orderId != undefined) {
            this.userService.showLoadingState(true);
            this.http
                .get(Values.BASE_URL + "orders/" + this.orderId)
                .subscribe((res: any) => {
                    if (res != null && res != undefined) {
                        if (res.isSuccess == true) {
                            this.userService.showLoadingState(false);
                            this.address = res.data.address.line1;
                            this.userName = res.data.name;
                            this.phoneNumber = res.data.phone;
                            this.totalAmount = res.data.grandTotal;
                            this.orderStatus = res.data.status;
                            if (this.orderStatus == "cancelled") {
                                this.cancelButtonText = "Cancelled";
                            }

                            if (res.data.length != 0) {
                                for (var j = 0; j < res.data.products.length; j++) {
                                    this.orderedProducts.push({
                                        image: res.data.products[j].image.url,
                                        name: res.data.products[j].name,
                                        weight: res.data.products[j].dimensions[0].value + " " + res.data.products[j].dimensions[0].unit,
                                        price: res.data.products[j].price.currency + " " + res.data.products[j].price.value,
                                        quantity: res.data.products[j].quantity,
                                        totalPrice: res.data.products[j].total,
                                    })
                                }
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
        this.router.navigate(['/myOrders']);
    }

    onCancelOrder() {
        if (this.orderStatus == "pending") {
            this.cancelOrderDialog.show();
        }
    }

    onYes() {
        if (this.orderStatus == "pending") {
            this.order.status = "cancelled";
            this.updateOrderStatus();
        }
    }

    onNo() {
        this.cancelOrderDialog.hide();
    }

    updateOrderStatus() {
        this.userService.showLoadingState(true);
        this.http
            .put(Values.BASE_URL + "orders/update/" + this.orderId, this.order)
            .subscribe((res: any) => {
                if (res != null && res != undefined) {
                    if (res.isSuccess == true) {
                        this.cancelOrderDialog.hide();
                        this.router.navigate(['./myOrders']);
                        this.userService.showLoadingState(false);
                        Toast.makeText("Order successfully cancelled!!!", "long").show();
                    }
                }
            }, error => {
                this.userService.showLoadingState(false);
                console.log(error.error.error);
            });
    }
}
