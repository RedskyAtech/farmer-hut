import { Component, OnInit, ViewChild } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { UserService } from "../../services/user.service";
import { User } from "~/app/models/user.model";
import { HttpClient } from "@angular/common/http";
import { Values } from "~/app/values/values";
import { ActivatedRoute } from "@angular/router";
import { ModalComponent } from "~/app/modals/modal.component";
import { NavigationService } from "~/app/services/navigation.service";
import { Page } from "tns-core-modules/ui/page/page";
import { BackgroundHttpService } from "~/app/services/background.http.service";
import { Product } from "~/app/models/product.model";

import * as localstorage from "nativescript-localstorage";
import * as Toast from 'nativescript-toast';

@Component({
    selector: "ns-confirmPhone",
    moduleId: module.id,
    templateUrl: "./confirm-phone.component.html",
    styleUrls: ["./confirm-phone.component.css"]
})
export class ConfirmPhoneComponent implements OnInit {
    @ViewChild('warningDialog') warningDialog: ModalComponent;

    otpBorderColor = "white";
    otpHint;
    otp: string;
    user: User;
    errorMessage: string;
    minutes: number;
    seconds: number;
    unit: string;
    isVisibleTimer: boolean;
    isVisibleOtpStatus: boolean;
    isVisibleResendButton: boolean;
    isRendering: boolean;
    isLoading: boolean;

    constructor(private routerExtensions: RouterExtensions, private navigationService: NavigationService, private route: ActivatedRoute, private userService: UserService, private http: HttpClient, private page: Page, private backgroundHttpService: BackgroundHttpService) {
        this.page.actionBarHidden = true;
        this.otpHint = "Enter OTP"
        this.otp = "";
        this.user = new User();
        this.userService.activeScreen('');
        this.errorMessage = "";
        this.minutes = 2;
        this.seconds = 59;
        this.unit = " minute";
        this.startTimer();
        this.isVisibleTimer = true;
        this.isVisibleOtpStatus = false;
        this.isVisibleResendButton = false;
        this.navigationService.backTo = "register";
        this.isLoading = false;
        this.isRendering = false;
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.isRendering = true;
        }, 50);
    }

    onOK() {
        this.warningDialog.hide();
    }

    onOtpTextChanged(args) {
        this.otpBorderColor = "#00C012"
        this.otp = args.object.text.toLowerCase();
    }
    onSubmit() {
        this.route.queryParams.subscribe(params => {
            this.user.phone = params["phone"];
            this.user.password = params["password"];
        });
        if (this.otp == "") {
            this.errorMessage = "Please enter otp.";
            this.warningDialog.show();
        }
        else if (this.otp.length < 6) {
            this.errorMessage = "Please enter six digit otp.";
            this.warningDialog.show();
        }
        else {
            this.isLoading = true;
            this.user.otp = this.otp;
            this.user.regToken = localstorage.getItem("regToken");
            this.userService.showLoadingState(true);
            this.http
                .post(Values.BASE_URL + "users/verifyRegOtp", this.user)
                .subscribe((res: any) => {
                    if (res != null && res != undefined) {
                        if (res.isSuccess == true) {
                            this.userService.showLoadingState(false);
                            Toast.makeText("Registered successfully!!!").show();
                            // this.routerExtensions.navigate(['/login']);
                            this.http
                                .post(Values.BASE_URL + "users/login", this.user)
                                .subscribe((res: any) => {
                                    if (res != null && res != undefined) {
                                        if (res.isSuccess == true) {
                                            this.userService.showLoadingState(false);
                                            if (res.data.type == "admin") {
                                                localstorage.removeItem('userToken');
                                                localstorage.removeItem('userId');
                                                if (res.data.token != "" && res.data.token != undefined) {
                                                    localstorage.setItem('adminToken', res.data.token);
                                                }
                                                if (res.data._id != null && res.data._id != undefined) {
                                                    localstorage.setItem('adminId', res.data._id);
                                                }
                                                localstorage.setItem('userType', res.data.type);
                                                Toast.makeText("Login successfully!!!", "long").show();
                                                this.routerExtensions.navigate(['./homeAdmin'], {
                                                    clearHistory: true,
                                                });
                                            }
                                            else {
                                                localstorage.removeItem('adminToken');
                                                localstorage.removeItem('adminId');
                                                if (res.data.token != "" && res.data.token != undefined) {
                                                    localstorage.setItem('userToken', res.data.token);
                                                }
                                                if (res.data._id != null && res.data._id != undefined) {
                                                    localstorage.setItem('userId', res.data._id);
                                                    this.http
                                                        .get(Values.BASE_URL + "users/" + localstorage.getItem("userId"))
                                                        .subscribe((res: any) => {
                                                            if (res != "" && res != undefined) {
                                                                if (res.isSuccess == true) {
                                                                    this.isLoading = false;
                                                                    localstorage.setItem('cartId', res.data.cartId);
                                                                    this.getCart(res.data.cartId);
                                                                }
                                                            }
                                                        }, error => {
                                                            this.isLoading = false;
                                                            if (error.error.error == undefined) {
                                                                this.errorMessage = "May be your network connection is low.";
                                                                this.warningDialog.show();
                                                            }
                                                            else {
                                                                this.errorMessage = error.error.error;
                                                                this.warningDialog.show();
                                                            }
                                                        });
                                                }
                                                localstorage.setItem('userType', res.data.type);
                                                Toast.makeText("Login successfully!!!", "long").show();
                                                this.routerExtensions.navigate(['./homeUser'], {
                                                    clearHistory: true,
                                                });
                                            }
                                        }
                                    }
                                }, error => {
                                    this.userService.showLoadingState(false);
                                    if (error.error.error == undefined) {
                                        this.errorMessage = "May be your network connection is low.";
                                        this.warningDialog.show();
                                    }
                                    else {
                                        this.errorMessage = error.error.error;
                                        this.warningDialog.show();
                                    }
                                    this.isLoading = false;
                                });
                        }
                    }
                }, error => {
                    this.isLoading = false;
                    this.userService.showLoadingState(false);
                    if (error.error.error == undefined) {
                        this.errorMessage = "May be your network connection is low.";
                        this.warningDialog.show();
                    }
                    else {
                        this.errorMessage = error.error.error;
                        this.warningDialog.show();
                    }
                });
        }
    }

    getCart(cartId: string) {
        var tempCart = [];
        this.backgroundHttpService.get(Values.BASE_URL + `carts/${cartId}`, {}).then((res: any) => {
            if (res != null && res != undefined) {
                console.log("RES:::CART:::", res)
                if (res.isSuccess == true) {
                    if (res.data && res.data.products) {
                        for (var i = 0; i < res.data.products.length; i++) {
                            tempCart.push(new Product(res.data.products[i]));
                        }
                    }
                    localstorage.setItem('cart', JSON.stringify(tempCart));
                }
            }
        }
            , error => {
                if (error.error.error == undefined) {
                    this.errorMessage = "May be your network connection is low.";
                    this.warningDialog.show();
                }
                else {
                    this.errorMessage = error.error.error;
                    this.warningDialog.show();
                }
            });
    }

    onResend() {
        this.route.queryParams.subscribe(params => {
            if (params["name"] != undefined) {
                this.user.name = params["name"];
            }
            if (params["phone"] != undefined) {
                this.user.phone = params["phone"];
            }
            if (params["password"] != undefined) {
                this.user.password = params["password"];
            }
        });
        this.userService.showLoadingState(true);
        this.http
            .post(Values.BASE_URL + "users", this.user)
            .subscribe((res: any) => {
                if (res != "" && res != undefined) {
                    if (res.isSuccess == true) {
                        this.userService.showLoadingState(false);
                        localstorage.setItem('regToken', res.data.regToken);
                        this.userService.showLoadingState(false);
                    }
                }
            }, error => {
                this.userService.showLoadingState(false);
                if (error.error.error == undefined) {
                    this.errorMessage = "May be your network connection is low.";
                    this.warningDialog.show();
                }
                else {
                    this.errorMessage = error.error.error;
                    this.warningDialog.show();
                }
            });
    }

    startTimer() {
        setInterval(() => {
            this.seconds--;
            if (this.seconds == 0) {
                this.seconds = 59;
                this.minutes--;
            }
            if (this.minutes == 0 && this.seconds == 1) {
                this.isVisibleOtpStatus = true;
                this.isVisibleResendButton = true;
                this.isVisibleTimer = false;
            }
        }, 1000);
    }

    onBack() {
        this.routerExtensions.back();
    }
}
