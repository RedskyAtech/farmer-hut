import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { HttpClient } from "@angular/common/http";
import { Values } from "~/app/values/values";
import { UserService } from '../../services/user.service';
import { NavigationService } from "~/app/services/navigation.service";
import { Page } from "tns-core-modules/ui/page/page";

import * as localstorage from "nativescript-localstorage";

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
    feebackPageNo = 1;
    isRenderingMessage: boolean;

    isLoadingFeedbacks: boolean;
    shouldLoadFeedbacks: boolean;

    constructor(private navigationService: NavigationService, private routerExtensions: RouterExtensions, private http: HttpClient, private userService: UserService, private page: Page) {
        this.page.actionBarHidden = true;
        this.feedbacks = [];
        this.isRendering = false;
        this.isLoading = false;

        this.shouldLoadFeedbacks = false;
        this.isLoadingFeedbacks = false;
        this.isRenderingMessage = false;

        this.userService.activeScreen('');
        this.navigationService.backTo = "profile";
        if (localstorage.getItem("adminToken") != null &&
            localstorage.getItem("adminToken") != undefined &&
            localstorage.getItem("adminId") != null &&
            localstorage.getItem("adminId") != undefined) {
            this.getFeedback();
        }
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.isRendering = true;
        })
    }

    onFeedbackItemLoading(args: any) {
        console.log('ProductItemLoaded:::', args.index)
        var criteria = (this.feebackPageNo * 10) - 5;
        if (this.shouldLoadFeedbacks) {
            if (args.index == criteria) {
                this.feebackPageNo = this.feebackPageNo + 1;
                this.getFeedback();
            }
        }
        this.shouldLoadFeedbacks = true;
    }

    getFeedback() {
        this.userService.showLoadingState(true);
        this.isLoadingFeedbacks = true;
        this.http
            .get(Values.BASE_URL + `feedbacks?pageNo=${this.feebackPageNo}&items=10`)
            .subscribe((res: any) => {
                if (res != null && res != undefined) {
                    if (res.isSuccess == true) {
                        this.isLoading = false;
                        this.userService.showLoadingState(false);
                        if (res.data.feedbacks.length > 0) {
                            for (var i = 0; i < res.data.feedbacks.length; i++) {
                                this.feedbacks.push({
                                    _id: res.data.feedbacks[i]._id,
                                    name: res.data.feedbacks[i].name,
                                    message: res.data.feedbacks[i].message
                                })
                            }
                        }
                        else {
                            this.isRenderingMessage = true;
                        }
                        setTimeout(() => {
                            this.isLoadingFeedbacks = false;
                        }, 5)
                        this.shouldLoadFeedbacks = false;
                    }
                }
            }, error => {
                setTimeout(() => {
                    this.isLoadingFeedbacks = false;
                }, 5)
                this.shouldLoadFeedbacks = false;
                this.isLoading = false;
                this.userService.showLoadingState(false);
                if (error.error.error == undefined) {
                    alert("Something went wrong!!! May be your network connection is low.");
                }
                else {
                    alert(error.error.error);
                }
            });
    }

    onBack() {
        this.routerExtensions.back();
    }
}
