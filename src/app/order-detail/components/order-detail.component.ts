import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { SelectedIndexChangedEventData } from "tns-core-modules/ui/tab-view";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import { ModalComponent } from "~/app/modals/modal.component";
import * as Toast from 'nativescript-toast';
import * as localstorage from "nativescript-localstorage";
import { HttpClient } from "@angular/common/http";
import { Values } from "~/app/values/values";
import { UserService } from '../../services/user.service';
import * as geolocation from "nativescript-geolocation";
import { Accuracy } from "tns-core-modules/ui/enums";
import { Directions } from "nativescript-directions";
import { Order } from "../../models/order.model";
let directions = new Directions();

@Component({
    selector: "ns-orderDetail",
    moduleId: module.id,
    templateUrl: "./order-detail.component.html",
    styleUrls: ["./order-detail.component.css"]
})
export class OrderDetailComponent implements OnInit, AfterViewInit {

    @ViewChild('confirmOrderDialog') confirmOrderDialog: ModalComponent;
    @ViewChild('rejectOrderDialog') rejectOrderDialog: ModalComponent;
    @ViewChild('rejectReasonDialog') rejectReasonDialog: ModalComponent;

    orderedProducts = [];
    userName: string;
    phoneNumber: string;
    address: string;
    mapAddress: string;
    totalAmount: string;
    orderId: string;
    userLatitude: string;
    userLongitude: string;
    orderStatus: string;
    confirmButtonText: string;
    confirmDialogButtonText: string;
    rejectButtonText: string;
    order: Order;
    isConfirmButton: boolean;
    isRejectButton: boolean;
    confirmDialogText: string;
    isTrackButton: boolean;
    isRenderingUserDetail: boolean;
    reasonHint: string;
    reasonBorderColor: string;
    reason: string;
    isReasonButton: boolean;

    constructor(private route: ActivatedRoute, private router: Router, private userService: UserService, private http: HttpClient) {
        this.userName = "";
        this.phoneNumber = "";
        this.address = "";
        this.mapAddress = "";
        this.totalAmount = "";
        this.isConfirmButton = false;
        this.isRejectButton = false;
        this.isTrackButton = false;
        this.isRenderingUserDetail = false;
        this.reasonHint = "Enter reason";
        this.reasonBorderColor = "#00C012";
        this.reason = "";
        this.isReasonButton = false;
        this.order = new Order();
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
                            this.userName = res.data.name;
                            this.phoneNumber = res.data.phone;
                            this.totalAmount = res.data.grandTotal;
                            this.orderStatus = res.data.status;
                            this.address = res.data.deliveryAddress.line1;
                            this.mapAddress = res.data.deliveryAddress.line2;
                            this.reason = res.data.reason;
                            this.isRenderingUserDetail = true;
                            if (this.orderStatus == "pending") {
                                this.confirmButtonText = "Confirm";
                                this.confirmDialogButtonText = "Confirm";
                                this.rejectButtonText = "Reject";
                                this.isConfirmButton = true;
                                this.isRejectButton = true;
                                this.isTrackButton = true;
                            }
                            else if (this.orderStatus == "confirmed") {
                                this.confirmButtonText = "Deliver";
                                this.confirmDialogButtonText = "Deliver";
                                this.rejectButtonText = "Reject";
                                this.isConfirmButton = true;
                                this.isRejectButton = true;
                                this.isTrackButton = true;
                            }
                            else if (this.orderStatus == "delivered") {
                                this.confirmButtonText = "Delivered";
                                this.isConfirmButton = true;
                                this.isRejectButton = false;
                                this.isTrackButton = false;
                            }
                            else if (this.orderStatus == "rejected") {
                                this.rejectButtonText = "Rejected";
                                this.isConfirmButton = false;
                                this.isTrackButton = false;
                                this.isRejectButton = true;
                                this.isReasonButton = true;
                            }
                            else {
                                this.rejectButtonText = "Reject";
                            }
                            if (res.data.length != 0) {
                                // for (var i = 0; i < res.data.length; i++) {
                                for (var j = 0; j < res.data.products.length; j++) {
                                    this.orderedProducts.push({
                                        image: res.data.products[j].image.url,
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
                    console.log(error.error.error);
                });
        }
    }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {

    }

    onReason() {
        this.rejectReasonDialog.show();
    }
    onCancelReason() {
        this.rejectReasonDialog.hide();
    }

    onReasonTextChanged(args) {
        this.reasonBorderColor = "#00C012";
        this.reason = args.object.text.toLowerCase();
    }

    onBack() {
        this.router.navigate(['/viewOrders']);
    }

    onConfirmOrder() {
        if (this.orderStatus == "pending") {
            this.confirmOrderDialog.show();
            this.confirmDialogText = "Are you sure you want to confirm this order.";
        }
        if (this.orderStatus == "confirmed") {
            this.confirmOrderDialog.show();
            this.confirmDialogText = "Are you sure you want to deliver this order.";
        }
    }

    onRejectOrder() {
        if (this.orderStatus != "rejected" && this.orderStatus != "delivered") {
            this.rejectOrderDialog.show();
            this.reasonBorderColor = "#00C012";
        }
    }

    onConfirm() {
        if (this.orderStatus == "pending") {
            this.order.status = "confirmed";
            this.updateOrderStatus();
        }
        if (this.orderStatus == "confirmed") {
            this.order.status = "delivered";
            this.updateOrderStatus();
        }
    }

    updateOrderStatus() {
        this.userService.showLoadingState(true);
        this.http
            .put(Values.BASE_URL + "orders/update/" + this.orderId, this.order)
            .subscribe((res: any) => {
                if (res != null && res != undefined) {
                    if (res.isSuccess == true) {
                        this.confirmOrderDialog.hide();
                        this.router.navigate(['./viewOrders']);
                        this.userService.showLoadingState(false);
                        if (this.order.status == "confirmed") {
                            Toast.makeText("Order successfully confirmed!!!", "long").show();
                            this.confirmButtonText = "Deliver";
                            this.confirmDialogButtonText = "Deliver";
                        }
                        else if (this.order.status == "delivered") {
                            Toast.makeText("Order successfully delivered!!!", "long").show();
                            this.confirmButtonText = "Delivered";
                        }
                        else {
                            Toast.makeText("Order successfully rejected!!!", "long").show();
                            this.confirmButtonText = "Delivered";
                        }
                    }
                }
            }, error => {
                this.userService.showLoadingState(false);
                console.log(error.error.error);
            });
    }

    onReject() {
        if (this.reason == "") {
            alert("Please enter rejection reason!!!");
        }
        else {
            this.order.status = "rejected";
            this.order.reason = this.reason;
            this.updateOrderStatus();
        }
    }

    onCancelConfirm() {
        this.confirmOrderDialog.hide();
    }

    onCancelReject() {
        this.rejectOrderDialog.hide();
    }

    onTrack() {
        if (this.mapAddress != null && this.mapAddress != undefined) {
            this.userService.showLoadingState(true);
            geolocation.enableLocationRequest();
            var that = this;
            // that.http
            //     .get(Values.GOOGLE_MAP_URL + "address=" + that.address + "," + "CA&key=AIzaSyA3-BQmJVYB6_soLJPv7cx2lFUMAuELlkM")
            //     .subscribe((res: any) => {
            //         that.userLatitude = res.results[0].geometry.location.lat;
            //         that.userLongitude = res.results[0].geometry.location.lng;
            //         // that.userService.showLoadingState(false);
            //         // // that.address = res.results[0].address_components[0].long_name;
            //         // that.address = res.results[0].formatted_address;
            //     }, error => {
            //         console.log(error);
            //     });
            geolocation.getCurrentLocation({ desiredAccuracy: Accuracy.high, updateDistance: 100, maximumAge: 20000 }).
                then(function (location) {
                    if (location) {
                        that.userService.showLoadingState(false);
                        directions.navigate({
                            // from: { // optional, default 'current location'
                            // },
                            // to: [{ // if an Array is passed (as in this example), the last item is the destination, the addresses in between are 'waypoints'.
                            //     address: "Hof der Kolommen 34, Amersfoort, Netherlands",
                            // },
                            // {
                            //     address: "Aak 98, Wieringerwerf, Netherlands"
                            // }],
                            to: {
                                address: that.mapAddress,
                                // lat: parseInt(that.userLatitude),
                                // lng: parseInt(that.userLongitude)
                            },
                            type: "driving", // optional, can be: driving, transit, bicycling or walking
                            ios: {
                                preferGoogleMaps: true, // If the Google Maps app is installed, use that one instead of Apple Maps, because it supports waypoints. Default true.
                                allowGoogleMapsWeb: true // If waypoints are passed in and Google Maps is not installed, you can either open Apple Maps and the first waypoint is used as the to-address (the rest is ignored), or you can open Google Maps on web so all waypoints are shown (set this property to true). Default false.
                            }
                        }).then(() => {
                            console.log("Maps app launched.");
                        }, error => {
                            console.log(error);
                        });

                    }
                }, function (e) {
                    console.log("Error: " + e.message);
                });
        }

    }
}
