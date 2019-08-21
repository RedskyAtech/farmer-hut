import { Component, OnInit, ViewChild } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { UserService } from "../../services/user.service";
import { User } from "~/app/models/user.model";
import { HttpClient } from "@angular/common/http";
import { Values } from "~/app/values/values";
import * as localstorage from "nativescript-localstorage";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import * as Toast from 'nativescript-toast';
import { ModalComponent } from "~/app/modals/modal.component";

@Component({
    selector: "ns-confirmPhone",
    moduleId: module.id,
    templateUrl: "./confirm-phone.component.html",
    styleUrls: ["./confirm-phone.component.css"]
})
export class ConfirmPhoneComponent implements OnInit {
    @ViewChild('warningDialog') warningDialog: ModalComponent;

    otpBorderColor = "white";
    otpHint;
    otp: string;
    user: User;
    errorMessage: string;
    minutes: number;
    seconds: number;
    unit: string;
    isVisibleTimer: boolean;
    isVisibleOtpStatus: boolean;
    isVisibleResendButton: boolean;

    constructor(private router: Router, private route: ActivatedRoute, private userService: UserService, private http: HttpClient) {
        this.otpHint = "Enter OTP"
        this.otp = "";
        this.user = new User();
        this.errorMessage = "";
        this.minutes = 2;
        this.seconds = 59;
        this.unit = " minute";
        this.startTimer();
        this.isVisibleTimer = true;
        this.isVisibleOtpStatus = false;
        this.isVisibleResendButton = false;
    }

    ngOnInit(): void {
    }

    onOK() {
        this.warningDialog.hide();
    }

    onOtpTextChanged(args) {
        this.otpBorderColor = "#00C012"
        this.otp = args.object.text.toLowerCase();
    }
    onSubmit() {
        this.route.queryParams.subscribe(params => {
            this.user.phone = params["phone"];
            this.user.password = params["password"];
        });
        if (this.otp == "") {
            this.errorMessage = "Please enter otp.";
            this.warningDialog.show();
            // alert("Please enter otp!!!");
        }
        else if (this.otp.length < 6) {
            this.errorMessage = "Please enter six digit otp.";
            this.warningDialog.show();
            // alert("Please enter six digit otp!!!");
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
                            // this.router.navigate(['./login']);
                            Toast.makeText("Registered successfully!!!").show();
                            this.http
                                .post(Values.BASE_URL + "users/login", this.user)
                                .subscribe((res: any) => {
                                    if (res != null && res != undefined) {
                                        if (res.isSuccess == true) {
                                            this.userService.showLoadingState(false);
                                            if (res.data.isVerified == false) {
                                                this.user.name = res.data.name;
                                                this.user.email = res.data.email;
                                            }
                                            else {
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
                                                    this.router.navigate(['./homeAdmin']);
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
                                                    // Toast.makeText("Login successfully!!!", "long").show();
                                                    this.router.navigate(['./homeUser']);
                                                }
                                            }
                                        }
                                    }
                                }, error => {
                                    this.userService.showLoadingState(false);
                                    alert(error.error.error);
                                });
                        }
                    }
                }, error => {
                    this.userService.showLoadingState(false);
                    alert(error.error.error);
                });
        }
    }

    onResend() {
        this.route.queryParams.subscribe(params => {
            if (params["name"] != undefined) {
                this.user.name = params["name"];
            }
            if (params["phone"] != undefined) {
                this.user.phone = params["phone"];
            }
            if (params["password"] != undefined) {
                this.user.password = params["password"];
            }
        });
        this.userService.showLoadingState(true);
        this.http
            .post(Values.BASE_URL + "users", this.user)
            .subscribe((res: any) => {
                if (res != "" && res != undefined) {
                    if (res.isSuccess == true) {
                        this.userService.showLoadingState(false);
                        localstorage.setItem('regToken', res.data.regToken);
                        this.userService.showLoadingState(false);
                    }
                }
            }, error => {
                this.userService.showLoadingState(false);
                console.log(error.error.error);
            });
    }

    startTimer() {
        setInterval(() => {
            this.seconds--;
            if (this.seconds == 0) {
                this.seconds = 59;
                this.minutes--;
            }
            if (this.minutes == 0 && this.seconds == 1) {
                this.isVisibleOtpStatus = true;
                this.isVisibleResendButton = true;
                this.isVisibleTimer = false;
            }
        }, 1000);
    }

    onBack() {
        this.router.navigate(['./register'])
    }
}
