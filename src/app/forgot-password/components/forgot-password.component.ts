import { Component, OnInit, ViewChild } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { UserService } from "../../services/user.service";
import { User } from "~/app/models/user.model";
import { HttpClient } from "@angular/common/http";
import { Values } from "~/app/values/values";
import { ModalComponent } from "~/app/modals/modal.component";
import { NavigationService } from "~/app/services/navigation.service";

import * as localstorage from "nativescript-localstorage";
import { Page } from "tns-core-modules/ui/page/page";


@Component({
    selector: "ns-forgotPassword",
    moduleId: module.id,
    templateUrl: "./forgot-password.component.html",
    styleUrls: ["./forgot-password.component.css"]
})
export class ForgotPasswordComponent implements OnInit {
    @ViewChild('warningDialog') warningDialog: ModalComponent;

    phoneBorderColor = "white";
    phoneHint = "Phone number";
    phone = "";
    emailBorderColor = "white";
    emailHint = "Email";
    email: string;
    user: User;
    errorMessage: string;

    constructor(private routerExtensions: RouterExtensions, private userService: UserService, private http: HttpClient, private navigationService: NavigationService, private page: Page) {
        this.email = "";
        this.phone = "";
        this.user = new User();
        this.errorMessage = "";
        this.navigationService.backTo = "login";
    }

    ngOnInit(): void {
    }

    onOK() {
        this.warningDialog.hide();
    }

    onPhoneTextChanged(args) {
        this.phoneBorderColor = "#00C012"
        this.phone = args.object.text.toLowerCase();
    }
    onEmailTextChanged(args) {
        this.emailBorderColor = "#00C012"
        this.email = args.object.text.toLowerCase();
    }
    onSendOtp() {
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
        // if (this.email == "") {
        //     alert("Please enter email!!!");
        // }
        else {
            // this.user.email = this.email;
            this.userService.showLoadingState(true);
            this.http
                .post(Values.BASE_URL + `users/sendSms?phone=${this.phone}`, {})
                .subscribe((res: any) => {
                    if (res != null && res != undefined) {
                        if (res.isSuccess == true) {
                            localstorage.setItem('tempToken', res.data.tempToken);
                            this.userService.showLoadingState(false);
                            this.routerExtensions.navigate(['./setPassword'], {
                                clearHistory: true,
                            });
                        }
                    }
                }, error => {
                    this.userService.showLoadingState(false);
                    alert(error.error.error);
                });
        }
    }

    onBack() {
        this.routerExtensions.navigate(['./login'], {
            clearHistory: true,
        })
    }
}
