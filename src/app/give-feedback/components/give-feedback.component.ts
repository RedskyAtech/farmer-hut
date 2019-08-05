import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import * as Toast from 'nativescript-toast';
import { HttpClient } from "@angular/common/http";
import { Values } from "~/app/values/values";
import { Feedback } from "~/app/models/feedback.model";
import { UserService } from "~/app/services/user.service";

@Component({
    selector: "ns-giveFeedback",
    moduleId: module.id,
    templateUrl: "./give-feedback.component.html",
    styleUrls: ["./give-feedback.component.css"]
})
export class GiveFeedbackComponent implements OnInit {

    feedbackBorderColor: string;
    feedbackHint: string;
    feedbackMessage: string;
    userId: string;
    feedback: Feedback;

    constructor(private routerExtensions: RouterExtensions, private http: HttpClient, private userService: UserService) {
        this.feedbackBorderColor = "white";
        this.feedbackHint = "Message";
        this.feedbackMessage = "";
        this.feedback = new Feedback();
    }

    ngOnInit(): void {
    }

    onFeedbackTextChanged(args) {
        this.feedbackBorderColor = "#E98A02"
        this.feedbackMessage = args.object.text.toLowerCase();
    }

    onSubmit() {
        if (this.feedbackMessage == "") {
            alert("Please enter message!!!");
        }
        else {
            if (localStorage.getItem("userId") != null && localStorage.getItem("userId") != undefined) {
                this.userId = localStorage.getItem("userId");
            }
            this.feedback.message = this.feedbackMessage;
            this.feedback.userId = this.userId;
            this.http
                .post(Values.BASE_URL + "feedbacks", this.feedback)
                .subscribe((res: any) => {
                    if (res != "" && res != undefined) {
                        if (res.isSuccess == true) {
                            this.userService.showLoadingState(false);
                            Toast.makeText("Feedback submitted successfully!!!", "long").show();
                        }
                    }
                }, error => {
                    this.userService.showLoadingState(false);
                    alert(error.error.error);
                });

            this.routerExtensions.navigate(['./profile'])
        }
    }

    onBack() {
        this.routerExtensions.navigate(['./profile'])
    }
}
