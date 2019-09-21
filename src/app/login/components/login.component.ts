import { Component, OnInit, ViewChild } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { User } from "~/app/models/user.model";
import { HttpClient } from "@angular/common/http";
import { Values } from "~/app/values/values";
import { UserService } from "../../services/user.service";
import { ModalComponent } from "~/app/modals/modal.component";
import { Color } from "tns-core-modules/color/color";
import { Page } from "tns-core-modules/ui/page/page";
import { BackgroundHttpService } from "~/app/services/background.http.service";

import * as Toast from 'nativescript-toast';
import * as localstorage from "nativescript-localstorage";
import { Product } from "~/app/models/product.model";
import { File, Folder } from "tns-core-modules/file-system/file-system";

declare const android: any;
declare const CGSizeMake: any;

@Component({
    selector: "ns-login",
    moduleId: module.id,
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {

    @ViewChild('userVerifyDialog') userVerifyDialog: ModalComponent;
    @ViewChild('warningDialog') warningDialog: ModalComponent;

    phoneBorderColor = "white";
    passwordBorderColor = "white";
    phoneHint = "Phone number";
    passwordHint = "Password";
    phone = "";
    password = "";
    user: User;
    userToken: string;
    errorMessage: string;
    isRendering: boolean;
    isLoading: boolean;


    constructor(private routerExtensions: RouterExtensions, private http: HttpClient, private userService: UserService, private page: Page, private backgroundHttpService: BackgroundHttpService) {
        this.page.actionBarHidden = true;
        this.isRendering = false;
        this.isLoading = false;
        this.user = new User();

        // this.file = File.fromPath(path.join(this.folder.)'FarmersHut.jpg');

        this.userService.showLoadingState(false);
        if (localstorage.getItem('cartId') && localstorage.getItem('cartId') != null && localstorage.getItem('cartId') != undefined && localstorage.getItem('cartId') != "") {
            this.getCart(localstorage.getItem('cartId'));
        }

        // if (localstorage.getItem("userToken") != null && localstorage.getItem("userToken") != undefined) {
        //     this.routerExtensions.navigate(['./homeUser'], {
        //         clearHistory: true,
        //     });
        // }
        // if (localstorage.getItem("adminToken") != null && localstorage.getItem("adminToken") != undefined) {
        //     this.routerExtensions.navigate(['./homeAdmin'], {
        //         clearHistory: true,
        //     });
        // }


        if (localstorage.getItem("userToken") != null && localstorage.getItem("userToken") != undefined) {
            this.routerExtensions.navigate(['./homeUser']);
        }
        if (localstorage.getItem("adminToken") != null && localstorage.getItem("adminToken") != undefined) {
            this.routerExtensions.navigate(['./homeAdmin']);
        }
        this.errorMessage = "";
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.isRendering = true;
        }, 50);
    }

    onPhoneTextChanged(args) {
        this.phoneBorderColor = "#00C012"
        this.passwordBorderColor = "white";
        this.phone = args.object.text.toLowerCase();
    }
    onPasswordTextChanged(args) {
        this.phoneBorderColor = "white";
        this.passwordBorderColor = "#00C012"
        this.password = args.object.text.toLowerCase();
    }

    onForgotPassword() {
        this.routerExtensions.navigate(['./forgotPassword'], {
            clearHistory: true,
        });
    }

    onOK() {
        this.warningDialog.hide();
    }

    onLogin() {
        if (this.phone == "") {
            this.errorMessage = "Please enter phone number.";
            this.warningDialog.show();
            // alert("Please enter phone number!!!");
        }
        else if (this.phone.length < 10) {
            this.errorMessage = "Please enter ten digit phone number.";
            this.warningDialog.show();
            // alert("Please enter ten digit phone number!!!");
        }
        else if (this.password == "") {
            this.errorMessage = "Please enter password.";
            this.warningDialog.show();
            alert("Please enter password!!!");
        }
        else if (this.password.length < 5) {
            this.errorMessage = "Password is too short, please enter minimum five characters.";
            this.warningDialog.show();
        }
        else {
            this.isLoading = true;
            this.user.phone = this.phone;
            this.user.password = this.password;
            this.userService.showLoadingState(true);
            this.http
                .post(Values.BASE_URL + "users/login", this.user)
                .subscribe((res: any) => {
                    if (res != null && res != undefined) {
                        if (res.isSuccess == true) {
                            this.userService.showLoadingState(false);
                            if (res.data.isVerified == false) {
                                this.user.name = res.data.name;
                                this.user.email = res.data.email;
                                this.userVerifyDialog.show();
                            }
                            else {
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
                                                        this.getCart(res.data.cartId)
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

    onVerify() {
        this.isLoading = true;
        this.http
            .post(Values.BASE_URL + "users", this.user)
            .subscribe((res: any) => {
                if (res != "" && res != undefined) {
                    if (res.isSuccess == true) {
                        this.isLoading = false;
                        // this.userService.showLoadingState(false);
                        this.userVerifyDialog.hide();
                        localstorage.setItem('regToken', res.data.regToken);
                        this.routerExtensions.navigate(['./confirmPhone'], {
                            clearHistory: true,
                        });
                    }
                }
            }, error => {
                // this.userService.showLoadingState(false);
                // alert(error.error.error);
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

    onCancel() {
        this.userVerifyDialog.hide();
    }

    onRegister() {
        this.routerExtensions.navigate(['./register'], {
            clearHistory: true,
        });
    }


    protected get shadowColor(): Color {
        return new Color('#888888')
    }

    protected get shadowOffset(): number {
        return 2.0
    }

    onDialogLoaded(args: any) {
        var dialog = <any>args.object;

        setTimeout(() => {
            if (dialog.android) {
                let nativeGridMain = dialog.android;
                var shape = new android.graphics.drawable.GradientDrawable();
                shape.setShape(android.graphics.drawable.GradientDrawable.RECTANGLE);
                shape.setColor(android.graphics.Color.parseColor('white'));
                shape.setCornerRadius(20)
                nativeGridMain.setBackgroundDrawable(shape);
                nativeGridMain.setElevation(20)
            } else if (dialog.ios) {
                let nativeGridMain = dialog.ios;

                nativeGridMain.layer.shadowColor = this.shadowColor.ios.CGColor;
                nativeGridMain.layer.shadowOffset = CGSizeMake(0, this.shadowOffset);
                nativeGridMain.layer.shadowOpacity = 0.5
                nativeGridMain.layer.shadowRadius = 5.0
                nativeGridMain.layer.shadowRadius = 5.0
            }

            // this.changeDetector.detectChanges();
        }, 400)

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

}

