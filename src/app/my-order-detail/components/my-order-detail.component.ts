import { Component, OnInit, ViewChild } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { ActivatedRoute } from "@angular/router";
import { ModalComponent } from "~/app/modals/modal.component";
import { UserService } from "~/app/services/user.service";
import { HttpClient } from "@angular/common/http";
import { Values } from "~/app/values/values";
import { Order } from "../../models/order.model";
import { NavigationService } from "~/app/services/navigation.service";
import { Page } from "tns-core-modules/ui/page/page";

import * as Toast from 'nativescript-toast';


@Component({
    selector: "ns-myOrderDetail",
    moduleId: module.id,
    templateUrl: "./my-order-detail.component.html",
    styleUrls: ["./my-order-detail.component.css"]
})

export class MyOrderDetailComponent implements OnInit {

    @ViewChild('cancelOrderDialog') cancelOrderDialog: ModalComponent;
    @ViewChild('rejectReasonDialog') rejectReasonDialog: ModalComponent;

    orderedProducts = [];
    userName: string;
    phoneNumber: string;
    address: string;
    totalAmount: string;
    orderId: string;
    orderid: string;
    userLatitude: string;
    userLongitude: string;
    orderStatus: string;
    order: Order;
    cancelButtonText: string;
    reason: string;
    isReasonButton: boolean;
    isCancelButton: boolean;
    isRenderingUserDetail: boolean;
    date: string;
    isRendering: boolean;
    isLoading: boolean;

    constructor(private route: ActivatedRoute, private navigationService: NavigationService, private routerExtensions: RouterExtensions, private userService: UserService, private http: HttpClient, private page: Page) {
        this.page.actionBarHidden = true;
        this.isRendering = false;
        this.isLoading = false;
        this.orderid = "";
        this.userName = "";
        this.phoneNumber = "";
        this.address = "";
        this.totalAmount = "";
        this.userService.activeScreen('');
        this.order = new Order();
        this.cancelButtonText = "Cancel your order";
        this.reason = "";
        this.isCancelButton = false;
        this.isReasonButton = false;
        this.date = "";
        this.navigationService.backTo = "myOrders";

        this.route.queryParams.subscribe(params => {
            if (params["orderId"] != "") {
                this.orderId = params["orderId"];
            }
        });
        if (this.orderId != null && this.orderId != undefined) {
            this.userService.showLoadingState(true);
            this.isLoading = true;
            this.http
                .get(Values.BASE_URL + "orders/" + this.orderId)
                .subscribe((res: any) => {
                    console.log("RES:::MYORDERDETAILS:::USER", res)
                    if (res != null && res != undefined) {
                        if (res.isSuccess == true) {
                            this.userService.showLoadingState(false);
                            this.isLoading = false;
                            this.address = res.data.deliveryAddress.line1;
                            this.orderid = res.data.orderId;
                            this.userName = res.data.name;
                            this.phoneNumber = res.data.phone;
                            this.totalAmount = res.data.grandTotal;
                            this.orderStatus = res.data.status;
                            this.reason = res.data.reason;
                            this.isRenderingUserDetail = true;
                            this.date = res.data.date;
                            var dateTime = new Date(this.date);
                            console.log(dateTime);
                            var hours = dateTime.getHours();
                            var ampm = "am";
                            if (hours > 12) {
                                var hours = hours - 12;
                                var ampm = "pm";
                            }
                            var minutes = dateTime.getMinutes().toString();
                            if (minutes.length < 2) {
                                minutes = "0" + minutes;
                            }
                            this.date = dateTime.getDate().toString() + "/" + (dateTime.getMonth() + 1).toString() + "/" + dateTime.getFullYear().toString() + " (" + hours + ":" + minutes + " " + ampm + ")";
                            if (this.orderStatus == "pending") {
                                this.cancelButtonText = "Cancel your order";
                                this.isCancelButton = true;
                            }
                            else if (this.orderStatus == "cancelled") {
                                this.cancelButtonText = "Cancelled";
                                this.isCancelButton = true;
                                this.isReasonButton = false;
                            }
                            else if (this.orderStatus == "delivered") {
                                this.isCancelButton = true;
                                this.cancelButtonText = "Delivered";
                            }
                            else if (this.orderStatus == "rejected") {
                                this.isReasonButton = true;
                            }
                            else {
                                this.cancelButtonText = "Confirmed";
                                this.isReasonButton = false;
                                this.isCancelButton = true;
                            }

                            if (res.data.length != 0) {
                                for (var j = 0; j < res.data.products.length; j++) {
                                    this.orderedProducts.push({
                                        image: res.data.products[j].image.resize_url,
                                        name: res.data.products[j].name,
                                        weight: res.data.products[j].dimensions[0].value + " " + res.data.products[j].dimensions[0].unit,
                                        price: "Rs " + res.data.products[j].price.value,
                                        quantity: res.data.products[j].quantity,
                                        totalPrice: res.data.products[j].total,
                                    })
                                }
                            }
                        }
                    }
                }, error => {
                    this.userService.showLoadingState(false);
                    this.isLoading = false;
                    if (error.error.error == undefined) {
                        alert("Something went wrong!!! May be your network connection is low.");
                    }
                    else {
                        alert(error.error.error);
                    }
                });
        }
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.isRendering = true;
        }, 50);
    }

    onReason() {
        this.rejectReasonDialog.show();
    }
    onCancelReason() {
        this.rejectReasonDialog.hide();
    }

    onBack() {
        this.routerExtensions.back();
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
        this.isLoading = true;
        this.http
            .put(Values.BASE_URL + "orders/update/" + this.orderId, this.order)
            .subscribe((res: any) => {
                console.log("RES:::UPDATE:::USER", res)
                if (res != null && res != undefined) {
                    if (res.isSuccess == true) {
                        this.cancelOrderDialog.hide();
                        this.routerExtensions.back();
                        this.userService.showLoadingState(false);
                        this.isLoading = false;
                        Toast.makeText("Order successfully cancelled!!!", "long").show();
                    }
                }
            }, error => {
                this.userService.showLoadingState(false);
                this.isLoading = false;
                if (error.error.error == undefined) {
                    alert("Something went wrong!!! May be your network connection is low.");
                }
                else {
                    alert(error.error.error);
                }
            });
    }
}
