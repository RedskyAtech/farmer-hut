import { Component, OnInit, ViewChild } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { HttpClient } from "@angular/common/http";
import { Values } from "~/app/values/values";
import { User } from "~/app/models/user.model";
import { UserService } from "../../services/user.service";
import { ModalComponent } from "~/app/modals/modal.component";
import { NavigationService } from "~/app/services/navigation.service";


import * as localstorage from "nativescript-localstorage";
import * as Toast from 'nativescript-toast';
import { Page } from "tns-core-modules/ui/page/page";


@Component({
    selector: "ns-changePassword",
    moduleId: module.id,
    templateUrl: "./change-password.component.html",
    styleUrls: ["./change-password.component.css"]
})
export class ChangePasswordComponent implements OnInit {
    @ViewChild('warningDialog') warningDialog: ModalComponent;

    oldPasswordBorderColor = "white";
    newPasswordBorderColor = "white";
    newRePasswordBorderColor = "white";
    oldPasswordHint = "Old password";
    newPasswordHint = "New password";
    newRePasswordHint = "Repeat new password";
    oldPassword = "";
    newPassword = "";
    newRePassword = "";
    user: User;
    userId: string;
    errorMessage: string;
    isLoading: boolean;

    constructor(private http: HttpClient, private routerExtensions: RouterExtensions, private navigationService: NavigationService, private userService: UserService, private page: Page) {
        this.page.actionBarHidden = true;
        this.isLoading = false;
        this.userService.activeScreen('');
        this.user = new User();
        this.errorMessage = "";
        if (localstorage.getItem("userType") == "admin") {
            if (localstorage.getItem("adminToken") != null && localstorage.getItem("adminToken") && localstorage.getItem("adminId") != null && localstorage.getItem("adminId") != undefined) {
                this.userId = localstorage.getItem("adminId");
            }
        }
        else {
            if (localstorage.getItem("userToken") != null && localstorage.getItem("userToken") && localstorage.getItem("userId") != null && localstorage.getItem("userId") != undefined) {
                this.userId = localstorage.getItem("userId");
            }
        }

        this.navigationService.backTo = "profile";

    }

    ngOnInit(): void {
    }

    onOK() {
        this.warningDialog.hide();
    }

    onOldPasswordTextChanged(args) {
        this.oldPasswordBorderColor = "#00C012"
        this.newPasswordBorderColor = "white";
        this.newRePasswordBorderColor = "white";
        this.oldPassword = args.object.text.toLowerCase();
    }
    onNewPasswordTextChanged(args) {
        this.oldPasswordBorderColor = "white";
        this.newPasswordBorderColor = "#00C012"
        this.newRePasswordBorderColor = "white";
        this.newPassword = args.object.text.toLowerCase();
    }
    onNewRePassTextChanged(args) {
        this.oldPasswordBorderColor = "white";
        this.newPasswordBorderColor = "white";
        this.newRePasswordBorderColor = "#00C012"
        this.newRePassword = args.object.text.toLowerCase();
    }

    onDone() {
        if (this.oldPassword == "") {
            this.errorMessage = "Please enter old password.";
            this.warningDialog.show();
        }
        else if (this.newPassword == "") {
            this.errorMessage = "Please enter new password.";
            this.warningDialog.show();
        }
        else if (this.newRePassword == "") {
            this.errorMessage = "Please enter repeat new password.";
            this.warningDialog.show();
        }
        else if (this.newPassword != this.newRePassword) {
            this.errorMessage = "Password and repeat password should be same.";
            this.warningDialog.show();
        }
        else {
            this.isLoading = true;
            this.userService.showLoadingState(true);
            this.user.password = this.oldPassword;
            this.user.newPassword = this.newPassword;
            this.http
                .put(Values.BASE_URL + "users/changePassword/" + this.userId, this.user)
                .subscribe((res: any) => {
                    if (res != null && res != undefined) {
                        if (res.isSuccess == true) {
                            this.isLoading = false;
                            this.userService.showLoadingState(false);
                            Toast.makeText("Password changed successfully!!!", "long").show();
                            this.routerExtensions.navigate(['./login'], {
                                clearHistory: true,
                            });
                            localstorage.removeItem('userToken');
                            localStorage.removeItem('adminToken');
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
        this.routerExtensions.navigate(['./profile'], {
            clearHistory: true,
        })
    }
}
