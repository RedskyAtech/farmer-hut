import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import * as Toast from 'nativescript-toast';
import { User } from "~/app/models/user.model";
import { HttpClient } from "@angular/common/http";
import { Values } from "~/app/values/values";
import { UserService } from '../services/user.service';
import * as localstorage from "nativescript-localstorage";

@Component({
    selector: "ns-register",
    moduleId: module.id,
    templateUrl: "./register.component.html",
    styleUrls: ["./register.component.css"]
})
export class RegisterComponent implements OnInit {

    nameBorderColor = "white";
    emailBorderColor = "white";
    phoneBorderColor = "white";
    passwordBorderColor = "white";
    rePasswordBorderColor = "white";
    nameHint = "Full name";
    emailHint = "Email";
    phoneHint = "Phone number";
    passwordHint = "Password";
    rePasswordHint = "Repeat password";
    name = "";
    email = "";
    phone = "";
    password = "";
    rePassword = "";
    user: User;

    constructor(private routerExtensions: RouterExtensions, private http: HttpClient, private userService: UserService) {
        this.user = new User();
    }

    ngOnInit(): void {
    }

    onNameTextChanged(args) {
        this.nameBorderColor = "#E98A02";
        this.emailBorderColor = "white";
        this.phoneBorderColor = "white";
        this.passwordBorderColor = "white";
        this.rePasswordBorderColor = "white";
        this.name = args.object.text.toLowerCase();
    }
    onEmailTextChanged(args) {
        this.nameBorderColor = "white";
        this.emailBorderColor = "#E98A02";
        this.phoneBorderColor = "white";
        this.passwordBorderColor = "white";
        this.rePasswordBorderColor = "white";
        this.email = args.object.text.toLowerCase();
    }
    onPhoneTextChanged(args) {
        this.nameBorderColor = "white";
        this.emailBorderColor = "white";
        this.phoneBorderColor = "#E98A02"
        this.passwordBorderColor = "white";
        this.rePasswordBorderColor = "white";
        this.phone = args.object.text.toLowerCase();
    }
    onPasswordTextChanged(args) {
        this.nameBorderColor = "white";
        this.emailBorderColor = "white";
        this.phoneBorderColor = "white";
        this.passwordBorderColor = "#E98A02"
        this.rePasswordBorderColor = "white";
        this.password = args.object.text.toLowerCase();
    }
    onRePassTextChanged(args) {
        this.nameBorderColor = "white";
        this.emailBorderColor = "white";
        this.phoneBorderColor = "white";
        this.passwordBorderColor = "white";
        this.rePasswordBorderColor = "#E98A02"
        this.rePassword = args.object.text.toLowerCase();
    }

    onRegister() {
        if (this.name == "") {
            alert("Please enter name!!!");
        }
        else if (!(this.name.match("^[a-zA-Z ]*$"))) {
            alert("Name contains characters only!!!");
        }
        else if (this.phone == "") {
            alert("Please enter phone number!!!");
        }
        else if (this.phone.length < 10) {
            alert("Please enter ten digit phone number!!!");
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
                            console.log(res);
                            this.userService.showLoadingState(false);
                            localstorage.setItem('regToken', res.data.regToken);
                            this.routerExtensions.navigate(['./confirmEmail']);
                        }
                    }
                }, error => {
                    this.userService.showLoadingState(false);
                    alert(error.error.error);
                });
        }
    }

    onLogin() {
        this.routerExtensions.navigate(['./login']);
    }
}
