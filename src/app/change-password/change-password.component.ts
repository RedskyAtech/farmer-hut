import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { HttpClient } from "@angular/common/http";
import { Values } from "~/app/values/values";
import { User } from "~/app/models/user.model";
import * as localstorage from "nativescript-localstorage";
import * as Toast from 'nativescript-toast';
import { UserService } from "../services/user.service";

@Component({
    selector: "ns-changePassword",
    moduleId: module.id,
    templateUrl: "./change-password.component.html",
    styleUrls: ["./change-password.component.css"]
})
export class ChangePasswordComponent implements OnInit {

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

    constructor(private http: HttpClient, private routerExtensions: RouterExtensions, private userService: UserService) {
        this.user = new User();
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

    }

    ngOnInit(): void {
    }

    onOldPasswordTextChanged(args) {
        this.oldPasswordBorderColor = "#E98A02"
        this.newPasswordBorderColor = "white";
        this.newRePasswordBorderColor = "white";
        this.oldPassword = args.object.text.toLowerCase();
    }
    onNewPasswordTextChanged(args) {
        this.oldPasswordBorderColor = "white";
        this.newPasswordBorderColor = "#E98A02"
        this.newRePasswordBorderColor = "white";
        this.newPassword = args.object.text.toLowerCase();
    }
    onNewRePassTextChanged(args) {
        this.oldPasswordBorderColor = "white";
        this.newPasswordBorderColor = "white";
        this.newRePasswordBorderColor = "#E98A02"
        this.newRePassword = args.object.text.toLowerCase();
    }

    onDone() {
        if (this.oldPassword == "") {
            alert("Please enter old password!!!");
        }
        else if (this.newPassword == "") {
            alert("Please enter new password!!!");
        }
        else if (this.newRePassword == "") {
            alert("Please enter repeat new password!!!");
        }
        else if (this.newPassword != this.newRePassword) {
            alert("Password and repeat password should be same!!!");
        }
        else {
            this.userService.showLoadingState(true);
            this.user.password = this.oldPassword;
            this.user.newPassword = this.newPassword;
            this.http
                .put(Values.BASE_URL + "users/changePassword/" + this.userId, this.user)
                .subscribe((res: any) => {
                    if (res != null && res != undefined) {
                        if (res.isSuccess == true) {
                            this.userService.showLoadingState(false);
                            Toast.makeText("Password changed successfully!!!", "long").show();
                            this.routerExtensions.navigate(['./login']);
                            localstorage.removeItem('userToken');
                            localStorage.removeItem('adminToken');
                        }
                    }
                }, error => {
                    this.userService.showLoadingState(false);
                    alert(error.error.error);
                });
        }
    }

    onBack() {
        this.routerExtensions.navigate(['./profile'])
    }
}
