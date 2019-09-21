import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { HttpClient } from "@angular/common/http";
import { Values } from "~/app/values/values";
import { UserService } from '../../services/user.service';
import { NavigationService } from "~/app/services/navigation.service";

import * as localstorage from "nativescript-localstorage";
import { Page } from "tns-core-modules/ui/page/page";

@Component({
    selector: "ns-viewFeedback",
    moduleId: module.id,
    templateUrl: "./view-feedback.component.html",
    styleUrls: ["./view-feedback.component.css"]
})

export class ViewFeedbackComponent implements OnInit {

    feedbacks;
    isRendering: boolean;
    isLoading: boolean;

    constructor(private navigationService: NavigationService, private routerExtensions: RouterExtensions, private http: HttpClient, private userService: UserService, private page: Page) {
        this.page.actionBarHidden = true;
        this.feedbacks = [];
        this.isRendering = false;
        this.isLoading = false;
        this.navigationService.backTo = "profile";
        if (localstorage.getItem("adminToken") != null &&
            localstorage.getItem("adminToken") != undefined &&
            localstorage.getItem("adminId") != null &&
            localstorage.getItem("adminId") != undefined) {
            this.userService.showLoadingState(true);
            this.isLoading = true;
            this.http
                .get(Values.BASE_URL + "feedbacks")
                .subscribe((res: any) => {
                    if (res != null && res != undefined) {
                        if (res.isSuccess == true) {
                            this.isLoading = false;
                            this.userService.showLoadingState(false);
                            for (var i = 0; i < res.data.feedbacks.length; i++) {
                                this.feedbacks.push({
                                    _id: res.data.feedbacks[i]._id,
                                    name: res.data.feedbacks[i].name,
                                    message: res.data.feedbacks[i].message
                                })
                            }
                        }
                    }
                }, error => {
                    this.isLoading = false;
                    this.userService.showLoadingState(false);
                    if (error.error.error == undefined) {
                        // this.errorMessage = "May be your network connection is low.";
                        // this.warningDialog.show();
                        alert("Something went wrong!!! May be your network connection is low.");
                    }
                    else {
                        // this.errorMessage = error.error.error;
                        // this.warningDialog.show();
                        alert(error.error.error);
                    }
                });
        }
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.isRendering = true;
        })
    }

    onBack() {
        // this.routerExtensions.navigate(['/profile'], {
        //     clearHistory: true,
        // });

        this.routerExtensions.back();
    }
}
