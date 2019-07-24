import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";

@Component({
    selector: "ns-giveFeedback",
    moduleId: module.id,
    templateUrl: "./give-feedback.component.html",
    styleUrls: ["./give-feedback.component.css"]
})
export class GiveFeedbackComponent implements OnInit {

    feedbackBorderColor = "white";
    feedbackHint = "Message";
    feedback = "";

    constructor(private routerExtensions: RouterExtensions) { }

    ngOnInit(): void {
    }

    onFeedbackTextChanged(args) {
        this.feedbackBorderColor = "#E98A02"
        this.feedback = args.object.text.toLowerCase();
    }

    onSubmit() {
        if (this.feedback == "") {
            alert("Please enter message!!!");
        }
        else {
            this.routerExtensions.navigate(['./profile'])
        }
    }

    onBack() {
        this.routerExtensions.navigate(['./profile'])
    }
}
