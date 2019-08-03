import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { UserService } from "../services/user.service";
import { User } from "~/app/models/user.model";
import { HttpClient } from "@angular/common/http";
import { Values } from "~/app/values/values";
import * as localstorage from "nativescript-localstorage";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import * as Toast from 'nativescript-toast';

@Component({
    selector: "ns-confirmEmail",
    moduleId: module.id,
    templateUrl: "./confirm-email.component.html",
    styleUrls: ["./confirm-email.component.css"]
})
export class ConfirmEmailComponent implements OnInit {

    otpBorderColor = "white";
    otpHint;
    otp: string;
    user: User;

    constructor(private router: Router, private route: ActivatedRoute, private userService: UserService, private http: HttpClient) {
        this.otpHint = "Enter OTP"
        this.otp = "";
        this.user = new User();
    }

    ngOnInit(): void {
    }

    onOtpTextChanged(args) {
        this.otpBorderColor = "#E98A02"
        this.otp = args.object.text.toLowerCase();
    }
    onSubmit() {
        if (this.otp == "") {
            alert("Please enter otp!!!");
        }
        else if (this.otp.length < 6) {
            alert("Please enter six digit otp!!!");
        }
        else {
            this.user.otp = this.otp;
            this.user.regToken = localstorage.getItem("regToken");
            this.userService.showLoadingState(true);
            this.http
                .post(Values.BASE_URL + "users/verifyRegOtp", this.user)
                .subscribe((res: any) => {
                    if (res != null && res != undefined) {
                        if (res.isSuccess == true) {
                            this.userService.showLoadingState(false);
                            this.router.navigate(['./login']);
                            Toast.makeText("Registered successfully!!!").show();
                        }
                    }
                }, error => {
                    this.userService.showLoadingState(false);
                    alert(error.error.error);
                });
        }
    }

    onBack() {
        this.router.navigate(['./login'])
    }
}
