import { Component, OnInit, ViewChild } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { UserService } from "../../services/user.service";
import { User } from "~/app/models/user.model";
import { HttpClient } from "@angular/common/http";
import { Values } from "~/app/values/values";
import { ModalComponent } from "~/app/modals/modal.component";
import { NavigationService } from "~/app/services/navigation.service";

import * as localstorage from "nativescript-localstorage";
import * as Toast from 'nativescript-toast';
import { Page } from "tns-core-modules/ui/page/page";


@Component({
    selector: "ns-setPassword",
    moduleId: module.id,
    templateUrl: "./set-password.component.html",
    styleUrls: ["./set-password.component.css"]
})
export class SetPasswordComponent implements OnInit {
    @ViewChild('warningDialog') warningDialog: ModalComponent;

    otpBorderColor = "white";
    passwordBorderColor = "white";
    rePasswordBorderColor = "white";
    otpHint = "Enter OTP";
    passwordHint = "Password";
    rePasswordHint = "Repeat password";
    otp = "";
    password = "";
    rePassword = "";
    user: User;
    errorMessage: string;
    isRendering: boolean;
    isLoading: boolean;

    constructor(private routerExtensions: RouterExtensions, private navigationService: NavigationService, private userService: UserService, private http: HttpClient, private page: Page) {
        this.user = new User();
        this.errorMessage = "";
        this.navigationService.backTo = "forgotPassword";
        this.page.actionBarHidden = true;
        this.isRendering = false;
        this.isLoading = false;
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.isRendering = true;
        }, 50);
    }

    onOtpTextChanged(args) {
        this.otpBorderColor = "#00C012"
        this.passwordBorderColor = "white";
        this.rePasswordBorderColor = "white";
        this.otp = args.object.text.toLowerCase();
    }
    onPasswordTextChanged(args) {
        this.otpBorderColor = "white";
        this.passwordBorderColor = "#00C012"
        this.rePasswordBorderColor = "white";
        this.password = args.object.text.toLowerCase();
    }
    onRePassTextChanged(args) {
        this.otpBorderColor = "white";
        this.passwordBorderColor = "white";
        this.rePasswordBorderColor = "#00C012"
        this.rePassword = args.object.text.toLowerCase();
    }

    onOK() {
        this.warningDialog.hide();
    }

    onDone() {
        if (this.otp == "") {
            this.errorMessage = "Please enter OTP.";
            this.warningDialog.show();
            // alert("Please enter OTP!!!");
        }
        else if (this.otp.length < 6) {
            this.errorMessage = "Please enter six digit otp.";
            this.warningDialog.show();
            // alert("Please enter six digit otp!!!");
        }
        else if (this.password == "") {
            this.errorMessage = "Please enter password.";
            this.warningDialog.show();
            // alert("Please enter password!!!");
        }
        else if (this.password.length < 5) {
            this.errorMessage = "Password is too short, please enter minimum five characters.";
            this.warningDialog.show();
        }
        else if (this.rePassword == "") {
            this.errorMessage = "Please enter repeat password";
            this.warningDialog.show();
            // alert("Please enter repeat password!!!");
        }
        else if (this.password.length < 5) {
            this.errorMessage = "Repeat password is too short, please enter minimum five characters.";
            this.warningDialog.show();
        }
        else if (this.password != this.rePassword) {
            this.errorMessage = "Password and repeat password should be same";
            this.warningDialog.show();
            // alert("Password and repeat password should be same!!!");
        }
        else {
            this.isLoading = true;
            this.userService.showLoadingState(true);
            this.user.otp = this.otp;
            this.user.newPassword = this.password;
            this.user.tempToken = localstorage.getItem("tempToken");
            this.http
                .post(Values.BASE_URL + "users/verifySms", this.user)
                .subscribe((res: any) => {
                    if (res != null && res != undefined) {
                        if (res.isSuccess == true) {
                            this.isLoading = false;
                            this.userService.showLoadingState(false);
                            Toast.makeText("Password set successfully!!!", "long").show();
                            this.routerExtensions.navigate(['./login'], {
                                clearHistory: true,
                            })
                        }
                    }
                }, error => {
                    this.isLoading = false;
                    this.userService.showLoadingState(false);
                    alert(error.error.error);
                });
        }
    }

    onBack() {
        this.routerExtensions.navigate(['./forgotPassword'], {
            clearHistory: true,
        })
    }
}
