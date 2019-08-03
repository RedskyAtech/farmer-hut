import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import * as Toast from 'nativescript-toast';
import { UserService } from "../services/user.service";
import { User } from "~/app/models/user.model";
import { HttpClient } from "@angular/common/http";
import { Values } from "~/app/values/values";
import * as localstorage from "nativescript-localstorage";

@Component({
    selector: "ns-setPassword",
    moduleId: module.id,
    templateUrl: "./set-password.component.html",
    styleUrls: ["./set-password.component.css"]
})
export class SetPasswordComponent implements OnInit {

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

    constructor(private routerExtensions: RouterExtensions, private userService: UserService, private http: HttpClient) {
        this.user = new User();
    }

    ngOnInit(): void {
    }

    onOtpTextChanged(args) {
        this.otpBorderColor = "#E98A02"
        this.passwordBorderColor = "white";
        this.rePasswordBorderColor = "white";
        this.otp = args.object.text.toLowerCase();
    }
    onPasswordTextChanged(args) {
        this.otpBorderColor = "white";
        this.passwordBorderColor = "#E98A02"
        this.rePasswordBorderColor = "white";
        this.password = args.object.text.toLowerCase();
    }
    onRePassTextChanged(args) {
        this.otpBorderColor = "white";
        this.passwordBorderColor = "white";
        this.rePasswordBorderColor = "#E98A02"
        this.rePassword = args.object.text.toLowerCase();
    }

    onDone() {
        if (this.otp == "") {
            alert("Please enter OTP!!!");
        }
        else if (this.otp.length < 6) {
            alert("Please enter six digit otp!!!");
        }
        else if (this.password == "") {
            alert("Please enter password!!!");
        }
        else if (this.rePassword == "") {
            alert("Please enter repeat password!!!");
        }
        else if (this.password != this.rePassword) {
            alert("Password and repeat password should be same!!!");
        }
        else {
            this.userService.showLoadingState(true);
            this.user.otp = this.otp;
            this.user.newPassword = this.password;
            this.user.tempToken = localstorage.getItem("tempToken");
            this.http
                .post(Values.BASE_URL + "users/verifyOtp", this.user)
                .subscribe((res: any) => {
                    if (res != null && res != undefined) {
                        if (res.isSuccess == true) {
                            this.userService.showLoadingState(false);
                            Toast.makeText("Password set successfully!!!", "long").show();
                            this.routerExtensions.navigate(['./login'])
                        }
                    }
                }, error => {
                    this.userService.showLoadingState(false);
                    alert(error.error.error);
                });
        }
    }

    onBack() {
        this.routerExtensions.navigate(['./forgotPassword'])
    }
}
