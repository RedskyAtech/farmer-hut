import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { UserService } from "../services/user.service";
import { User } from "~/app/models/user.model";
import { HttpClient } from "@angular/common/http";
import { Values } from "~/app/values/values";
import * as localstorage from "nativescript-localstorage";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";

@Component({
    selector: "ns-confirmEmail",
    moduleId: module.id,
    templateUrl: "./confirm-email.component.html",
    styleUrls: ["./confirm-email.component.css"]
})
export class ConfirmEmailComponent implements OnInit {

    phoneBorderColor = "white";
    phoneHint = "Phone number";
    phone = "";
    emailBorderColor = "white";
    emailHint = "Email";
    email: string;
    user: User;

    constructor(private router: Router, private route: ActivatedRoute, private userService: UserService, private http: HttpClient) {
        this.email = "";
        this.user = new User();
    }

    ngOnInit(): void {
    }

    onPhoneTextChanged(args) {
        this.phoneBorderColor = "#E98A02"
        this.phone = args.object.text.toLowerCase();
    }
    onEmailTextChanged(args) {
        this.emailBorderColor = "#E98A02"
        this.email = args.object.text.toLowerCase();
    }
    onSendOtp() {
        // if (this.phone == "") {
        //     alert("Please enter phone number!!!");
        // }
        // else if (this.phone.length < 10) {
        //     alert("Please enter ten digit phone number!!!");
        // }
        if (this.email == "") {
            alert("Please enter email!!!");
        }
        else {
            this.user.email = this.email;
            this.userService.showLoadingState(true);
            this.http
                .post(Values.BASE_URL + "users/forgotPassword", this.user)
                .subscribe((res: any) => {
                    if (res != null && res != undefined) {
                        if (res.isSuccess == true) {
                            localstorage.setItem('tempToken', res.data.tempToken);
                            this.userService.showLoadingState(false);
                            let navigationExtras: NavigationExtras = {
                                queryParams: {
                                    "email": this.email,
                                },
                            };
                            this.router.navigate(['./register'], navigationExtras);
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
