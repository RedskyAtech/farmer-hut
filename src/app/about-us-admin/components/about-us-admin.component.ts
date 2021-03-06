import { Component, OnInit, ViewChild } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { NavigationService } from "~/app/services/navigation.service";
import { UserService } from "~/app/services/user.service";
import { ModalComponent } from "~/app/modals/modal.component";
import { HttpClient } from "@angular/common/http";
import { Values } from "~/app/values/values";
import { AboutUs } from "~/app/models/aboutUs.model";
import { Color } from "tns-core-modules/color/color";

import * as Toast from 'nativescript-toast';
import { Page } from "tns-core-modules/ui/page/page";

declare const android: any;
declare const CGSizeMake: any;

@Component({
    selector: "ns-aboutUsAdmin",
    moduleId: module.id,
    templateUrl: "./about-us-admin.component.html",
    styleUrls: ["./about-us-admin.component.css"]
})
export class AboutUsAdminComponent implements OnInit {

    @ViewChild('warningDialog') warningDialog: ModalComponent;

    aboutDescription: string;
    aboutBorderColor: string;
    aboutHint: string;
    aboutText: string;
    about: string;
    errorMessage: string;
    aboutUs: AboutUs;
    aboutId: string;
    isRendering: boolean;
    isLoading: boolean;
    isRenderingMessage: boolean;

    constructor(private http: HttpClient, private routerExtensions: RouterExtensions, private navigationService: NavigationService, private userService: UserService, private page: Page) {
        this.userService.activeScreen('');
        this.page.actionBarHidden = true;
        this.navigationService.backTo = "profile";
        this.aboutHint = "Tell us about yourself";
        this.aboutText = "";
        this.aboutBorderColor = "white";
        this.errorMessage = "";
        this.aboutDescription = "";
        this.aboutUs = new AboutUs();
        this.aboutId = "";
        this.isLoading = false;
        this.isRendering = false;
        this.getAbout();
        
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.isRendering = true;
        }, 50);
    }

    protected get shadowColor(): Color {
        return new Color('#888888')
    }

    protected get shadowOffset(): number {
        return 2.0
    }

    onDialogLoaded(args: any) {
        var dialog = <any>args.object;

        setTimeout(() => {
            if (dialog.android) {
                let nativeGridMain = dialog.android;
                var shape = new android.graphics.drawable.GradientDrawable();
                shape.setShape(android.graphics.drawable.GradientDrawable.RECTANGLE);
                shape.setColor(android.graphics.Color.parseColor('white'));
                shape.setCornerRadius(20)
                nativeGridMain.setBackgroundDrawable(shape);
                nativeGridMain.setElevation(20)
            } else if (dialog.ios) {
                let nativeGridMain = dialog.ios;
                nativeGridMain.layer.shadowColor = this.shadowColor.ios.CGColor;
                nativeGridMain.layer.shadowOffset = CGSizeMake(0, this.shadowOffset);
                nativeGridMain.layer.shadowOpacity = 0.5
                nativeGridMain.layer.shadowRadius = 5.0
                nativeGridMain.layer.shadowRadius = 5.0
            }
        }, 400)

    }

    onAboutTextChanged(args) {
        this.aboutBorderColor = "#00C012"
        this.aboutText = args.object.text.toLowerCase();
    }

    onSubmit() {
        if (this.aboutText == "") {
            this.errorMessage = "Please enter about detail.";
            this.warningDialog.show();
        }
        else {
            this.isLoading = true;
            this.aboutUs.description = this.aboutText;
            this.userService.showLoadingState(true);
            this.http
                .get(Values.BASE_URL + "aboutUs")
                .subscribe((res: any) => {
                    if (res != null && res != undefined) {
                        if (res.isSuccess == true) {
                            this.aboutId = res.data[0]._id;
                            console.log(this.aboutId);
                            this.http
                                .put(Values.BASE_URL + "aboutUs/update/" + this.aboutId, this.aboutUs)
                                .subscribe((res: any) => {
                                    if (res != null && res != undefined) {
                                        if (res.isSuccess == true) {
                                            this.isLoading = false;
                                            Toast.makeText("About detail added successfully!!!", "long").show();
                                            this.getAbout();
                                        }
                                    }
                                }, error => {
                                    this.userService.showLoadingState(false);
                                    this.isLoading = false;
                                    alert(error.error.error);
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

    getAbout() {
        this.isLoading = true;
        this.http
            .get(Values.BASE_URL + "aboutUs")
            .subscribe((res: any) => {
                if (res != null && res != undefined) {
                    if (res.isSuccess == true) {
                        this.isLoading = false;
                        this.userService.showLoadingState(false);
                        this.aboutDescription = res.data[0].description;
                        this.about = res.data[0].description;
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

    onOK() {
        this.warningDialog.hide();
    }

    onBack() {
        this.routerExtensions.back();
    }
}
