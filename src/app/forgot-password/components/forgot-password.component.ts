import { Component, OnInit, ViewChild } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { UserService } from "../../services/user.service";
import { User } from "~/app/models/user.model";
import { HttpClient } from "@angular/common/http";
import { Values } from "~/app/values/values";
import { ModalComponent } from "~/app/modals/modal.component";
import { NavigationService } from "~/app/services/navigation.service";
import { Page } from "tns-core-modules/ui/page/page";

import * as localstorage from "nativescript-localstorage";


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
    isRendering: boolean;
    isLoading: boolean;
    constructor(private routerExtensions: RouterExtensions, private userService: UserService, private http: HttpClient, private navigationService: NavigationService, private page: Page) {
        this.email = "";
        this.phone = "";
        this.user = new User();
        this.userService.activeScreen('');
        this.errorMessage = "";
        this.navigationService.backTo = "login";
        this.page.actionBarHidden = true;
        this.isRendering = false;
        this.isLoading = false;
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.isRendering = true;
        }, 50);
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
        }
        else if (this.phone.length < 10) {
            this.errorMessage = "Please enter ten digit phone number.";
            this.warningDialog.show();
        }
        else {
            this.isLoading = true;
            this.userService.showLoadingState(true);
            this.http
                .post(Values.BASE_URL + `users/sendSms?phone=${this.phone}`, {})
                .subscribe((res: any) => {
                    if (res != null && res != undefined) {
                        if (res.isSuccess == true) {
                            this.isLoading = false;
                            localstorage.setItem('tempToken', res.data.tempToken);
                            this.userService.showLoadingState(false);
                            this.routerExtensions.navigate(['./setPassword']);
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

    onBack() {
        this.routerExtensions.back();
    }
}
