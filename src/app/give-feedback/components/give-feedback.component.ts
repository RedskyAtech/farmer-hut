import { Component, OnInit, ViewChild } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { HttpClient } from "@angular/common/http";
import { Values } from "~/app/values/values";
import { Feedback } from "~/app/models/feedback.model";
import { ModalComponent } from "~/app/modals/modal.component";
import { NavigationService } from "~/app/services/navigation.service";

import * as Toast from 'nativescript-toast';
import { Page } from "tns-core-modules/ui/page/page";


@Component({
    selector: "ns-giveFeedback",
    moduleId: module.id,
    templateUrl: "./give-feedback.component.html",
    styleUrls: ["./give-feedback.component.css"]
})
export class GiveFeedbackComponent implements OnInit {
    @ViewChild('warningDialog') warningDialog: ModalComponent;

    feedbackBorderColor: string;
    feedbackHint: string;
    feedbackMessage: string;
    userId: string;
    feedback: Feedback;
    errorMessage: string;
    isRendering: boolean;
    isLoading: boolean;

    constructor(private routerExtensions: RouterExtensions, private navigationService: NavigationService, private http: HttpClient, private page: Page) {
        this.page.actionBarHidden = true;
        this.isLoading = false;
        this.isRendering = false;
        this.feedbackBorderColor = "white";
        this.feedbackHint = "Message";
        this.feedbackMessage = "";
        this.feedback = new Feedback();
        this.errorMessage = "";
        this.navigationService.backTo = "profile";
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.isRendering = true;
        })
    }

    onOK() {
        this.warningDialog.hide();
    }

    onFeedbackTextChanged(args) {
        this.feedbackBorderColor = "#00C012"
        this.feedbackMessage = args.object.text.toLowerCase();
    }

    onSubmit() {
        if (this.feedbackMessage == "") {
            this.errorMessage = "Please enter message.";
            this.warningDialog.show();
            // alert("Please enter message!!!");
        }
        else {
            if (localStorage.getItem("userId") != null && localStorage.getItem("userId") != undefined) {
                this.userId = localStorage.getItem("userId");
            }
            this.isLoading = true;
            this.feedback.message = this.feedbackMessage;
            this.feedback.userId = this.userId;
            this.http
                .post(Values.BASE_URL + "feedbacks", this.feedback)
                .subscribe((res: any) => {
                    if (res != "" && res != undefined) {
                        if (res.isSuccess == true) {
                            this.isLoading = false;
                            Toast.makeText("Feedback submitted successfully!!!", "long").show();
                            this.routerExtensions.back();
                        }
                    }
                }, error => {
                    this.isLoading = false;
                    this.routerExtensions.back();
                    if (error.error.error == undefined) {
                        this.errorMessage = "May be your network connection is low.";
                        this.warningDialog.show();
                        // alert("Something went wrong!!! May be your network connection is low.");
                    }
                    else {
                        this.errorMessage = error.error.error;
                        this.warningDialog.show();
                        // alert(error.error.error);
                    }
                });

            // this.routerExtensions.navigate(['./profile'], {
            //     clearHistory: true,
            // })
        }
    }

    onBack() {
        // this.routerExtensions.navigate(['./profile'], {
        //     clearHistory: true,
        // })

        this.routerExtensions.back();
    }
}
