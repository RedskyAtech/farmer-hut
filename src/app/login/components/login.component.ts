import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import * as Toast from 'nativescript-toast';
import { User } from "~/app/models/user.model";
import { HttpClient } from "@angular/common/http";
import { Values } from "~/app/values/values";
import * as localstorage from "nativescript-localstorage";
import { UserService } from "../../services/user.service";

@Component({
    selector: "ns-register",
    moduleId: module.id,
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {

    phoneBorderColor = "white";
    passwordBorderColor = "white";
    phoneHint = "Phone number";
    passwordHint = "Password";
    phone = "";
    password = "";
    user: User;
    userToken: string;

    constructor(private routerExtensions: RouterExtensions, private http: HttpClient, private userService: UserService) {
        this.user = new User();
        if (localstorage.getItem("userToken") != null && localstorage.getItem("userToken") != undefined) {
            this.routerExtensions.navigate(['./homeUser']);
        }
        if (localstorage.getItem("adminToken") != null && localstorage.getItem("adminToken") != undefined) {
            this.routerExtensions.navigate(['./homeAdmin']);
        }
    }

    ngOnInit(): void {
    }

    onPhoneTextChanged(args) {
        this.phoneBorderColor = "#E98A02"
        this.passwordBorderColor = "white";
        this.phone = args.object.text.toLowerCase();
    }
    onPasswordTextChanged(args) {
        this.phoneBorderColor = "white";
        this.passwordBorderColor = "#E98A02"
        this.password = args.object.text.toLowerCase();
    }

    onForgotPassword() {
        this.routerExtensions.navigate(['./forgotPassword']);
    }

    onLogin() {
        if (this.phone == "") {
            alert("Please enter phone number!!!");
        }
        else if (this.phone.length < 10) {
            alert("Please enter ten digit phone number!!!");
        }
        else if (this.password == "") {
            alert("Please enter password!!!");
        }
        else {

            this.user.phone = this.phone;
            this.user.password = this.password;
            this.userService.showLoadingState(true);
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
                                this.routerExtensions.navigate(['./homeAdmin']);
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
                                                    localstorage.setItem('cartId', res.data.cartId);
                                                }
                                            }
                                        }, error => {
                                            alert(error.error.error);
                                        });
                                }
                                localstorage.setItem('userType', res.data.type);
                                Toast.makeText("Login successfully!!!", "long").show();
                                this.routerExtensions.navigate(['./homeUser']);
                            }
                        }
                    }
                }, error => {
                    this.userService.showLoadingState(false);
                    alert(error.error.error);
                });
        }
    }

    onRegister() {
        this.routerExtensions.navigate(['./register']);
    }

}

