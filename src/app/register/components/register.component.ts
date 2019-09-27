import { Component, OnInit, ViewChild } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { User } from "~/app/models/user.model";
import { HttpClient } from "@angular/common/http";
import { Values } from "~/app/values/values";
import { UserService } from '../../services/user.service';
import { ModalComponent } from "~/app/modals/modal.component";
import { Page } from "tns-core-modules/ui/page/page";

import * as localstorage from "nativescript-localstorage";


@Component({
    selector: "ns-register",
    moduleId: module.id,
    templateUrl: "./register.component.html",
    styleUrls: ["./register.component.css"]
})
export class RegisterComponent implements OnInit {

    @ViewChild('userVerifyDialog') userVerifyDialog: ModalComponent;
    @ViewChild('warningDialog') warningDialog: ModalComponent;

    nameBorderColor = "white";
    emailBorderColor = "white";
    phoneBorderColor = "white";
    passwordBorderColor = "white";
    rePasswordBorderColor = "white";
    nameHint = "Full name";
    emailHint = "Email (optional)";
    phoneHint = "Phone number";
    passwordHint = "Password";
    rePasswordHint = "Repeat password";
    name = "";
    email = "";
    phone = "";
    password = "";
    rePassword = "";
    user: User;
    errorMessage: string;
    isRendering: boolean;
    isLoading: boolean;

    constructor(private routerExtensions: RouterExtensions, private http: HttpClient, private userService: UserService, private page: Page) {
        this.user = new User();
        this.errorMessage = "";
        this.page.actionBarHidden = true;
        this.userService.activeScreen('');
        this.isRendering = false;
        this.isLoading = false;
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.isRendering = true;
        }, 50);
    }

    onNameTextChanged(args) {
        this.nameBorderColor = "#00C012";
        this.emailBorderColor = "white";
        this.phoneBorderColor = "white";
        this.passwordBorderColor = "white";
        this.rePasswordBorderColor = "white";
        this.name = args.object.text.toLowerCase();
    }
    onEmailTextChanged(args) {
        this.nameBorderColor = "white";
        this.emailBorderColor = "#00C012";
        this.phoneBorderColor = "white";
        this.passwordBorderColor = "white";
        this.rePasswordBorderColor = "white";
        this.email = args.object.text.toLowerCase();
    }
    onPhoneTextChanged(args) {
        this.nameBorderColor = "white";
        this.emailBorderColor = "white";
        this.phoneBorderColor = "#00C012"
        this.passwordBorderColor = "white";
        this.rePasswordBorderColor = "white";
        this.phone = args.object.text.toLowerCase();
    }
    onPasswordTextChanged(args) {
        this.nameBorderColor = "white";
        this.emailBorderColor = "white";
        this.phoneBorderColor = "white";
        this.passwordBorderColor = "#00C012"
        this.rePasswordBorderColor = "white";
        this.password = args.object.text.toLowerCase();
    }
    onRePassTextChanged(args) {
        this.nameBorderColor = "white";
        this.emailBorderColor = "white";
        this.phoneBorderColor = "white";
        this.passwordBorderColor = "white";
        this.rePasswordBorderColor = "#00C012"
        this.rePassword = args.object.text.toLowerCase();
    }
    onOK() {
        this.warningDialog.hide();
    }

    onRegister() {
        if (this.name == "") {
            this.errorMessage = "Please enter name.";
            this.warningDialog.show();
        }
        else if (!(this.name.match("^[a-zA-Z ]*$"))) {
            this.errorMessage = "Name contains characters only.";
            this.warningDialog.show();
        }
        else if (this.phone == "") {
            this.errorMessage = "Please enter phone number.";
            this.warningDialog.show();
        }
        else if (this.phone.length < 10) {
            this.errorMessage = "Please enter ten digit phone number.";
            this.warningDialog.show();
        }
        else if (this.password == "") {
            this.errorMessage = "Please enter password.";
            this.warningDialog.show();
        }
        else if (this.password.length < 6) {
            this.errorMessage = "Password is too short, please enter minimum six characters.";
            this.warningDialog.show();
        }
        else if (this.rePassword == "") {
            this.errorMessage = "Please enter repeat password.";
            this.warningDialog.show();
        }
        else if (this.rePassword.length < 5) {
            this.errorMessage = "Repeat password is too short, please enter minimum five characters.";
            this.warningDialog.show();
        }
        else if (this.password != this.rePassword) {
            this.errorMessage = "Password and repeat password should be same.";
            this.warningDialog.show();
        }
        else {
            this.isLoading = true;
            this.userService.showLoadingState(true);
            this.user.name = this.name;
            this.user.phone = this.phone;
            this.user.password = this.password;
            if (this.email != "") {
                this.user.email = this.email;
            }
            this.http
                .post(Values.BASE_URL + "users", this.user)
                .subscribe((res: any) => {
                    if (res != "" && res != undefined) {
                        if (res.isSuccess == true) {
                            this.userService.showLoadingState(false);
                            localstorage.setItem('regToken', res.data.regToken);
                            this.isLoading = false;
                            this.routerExtensions.navigate(['./confirmPhone'], {
                                queryParams: {
                                    "name": this.name,
                                    "phone": this.phone,
                                    "password": this.password
                                },
                                clearHistory: true,
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

    onVerify() {
        this.isLoading = true;
        this.http
            .post(Values.BASE_URL + "users", this.user)
            .subscribe((res: any) => {
                if (res != "" && res != undefined) {
                    if (res.isSuccess == true) {
                        this.isLoading = false;
                        this.userService.showLoadingState(false);
                        this.userVerifyDialog.hide();
                        localstorage.setItem('regToken', res.data.regToken);
                        this.routerExtensions.navigate(['./confirmPhone'], {
                            clearHistory: true,
                        });
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

    onCancel() {
        this.userVerifyDialog.hide();
    }

    onLogin() {
        this.routerExtensions.back();
    }
}
