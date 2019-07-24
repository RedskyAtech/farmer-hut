import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import { Product } from "../models/product";


@Component({
    selector: "ns-viewFeedback",
    moduleId: module.id,
    templateUrl: "./view-feedback.component.html",
    styleUrls: ["./view-feedback.component.css"]
})

export class ViewFeedbackComponent implements OnInit {

    feedbacks = [];

    constructor(private route: ActivatedRoute, private router: Router) {

    }

    ngOnInit(): void {
        this.feedbacks.push({ name: "sadfd sadasdad", message: "sdgh adsjg jgsda jgad hgasd sdgh adsjg jgsda jgad hgasd sdgh adsjg jgsda jgad hgasd jasg dss sadud adssa d a dasd d ad jasg dss sadud adssa d a dasd d ad d ASDASD AS SAD SA D AS", });
        this.feedbacks.push({ name: "sadfd sadasdad", message: "sdgh adsjg jgsda jgad hgasd sdgh adsjg jgsda jgad hgasd sdgh adsjg jgsda jgad hgasd jasg dss sadud adssa d a dasd d ad jasg dss sadud adssa d a dasd d ad d ASDASD AS SAD SA D AS", });
        this.feedbacks.push({ name: "sadfd sadasdad", message: "sdgh adsjg jgsda jgad hgasd sdgh adsjg jgsda jgad hgasd sdgh adsjg jgsda jgad hgasd jasg dss sadud adssa d a dasd d ad jasg dss sadud adssa d a dasd d ad d ASDASD AS SAD SA D AS", });
        this.feedbacks.push({ name: "sadfd sadasdad", message: "sdgh adsjg jgsda jgad hgasd sdgh adsjg jgsda jgad hgasd sdgh adsjg jgsda jgad hgasd jasg dss sadud adssa d a dasd d ad jasg dss sadud adssa d a dasd d ad d ASDASD AS SAD SA D AS", });
        this.feedbacks.push({ name: "sadfd sadasdad", message: "sdgh adsjg jgsda jgad hgasd sdgh adsjg jgsda jgad hgasd sdgh adsjg jgsda jgad hgasd jasg dss sadud adssa d a dasd d ad jasg dss sadud adssa d a dasd d ad d ASDASD AS SAD SA D AS", });
        this.feedbacks.push({ name: "sadfd sadasdad", message: "sdgh adsjg jgsda jgad hgasd sdgh adsjg jgsda jgad hgasd sdgh adsjg jgsda jgad hgasd jasg dss sadud adssa d a dasd d ad jasg dss sadud adssa d a dasd d ad d ASDASD AS SAD SA D AS", });
        this.feedbacks.push({ name: "sadfd sadasdad", message: "sdgh adsjg jgsda jgad hgasd sdgh adsjg jgsda jgad hgasd sdgh adsjg jgsda jgad hgasd jasg dss sadud adssa d a dasd d ad jasg dss sadud adssa d a dasd d ad d ASDASD AS SAD SA D AS", });
        this.feedbacks.push({ name: "sadfd sadasdad", message: "sdgh adsjg jgsda jgad hgasd sdgh adsjg jgsda jgad hgasd sdgh adsjg jgsda jgad hgasd jasg dss sadud adssa d a dasd d ad jasg dss sadud adssa d a dasd d ad d ASDASD AS SAD SA D AS", });
        this.feedbacks.push({ name: "sadfd sadasdad", message: "sdgh adsjg jgsda jgad hgasd sdgh adsjg jgsda jgad hgasd sdgh adsjg jgsda jgad hgasd jasg dss sadud adssa d a dasd d ad jasg dss sadud adssa d a dasd d ad d ASDASD AS SAD SA D AS", });
    }

    onBack() {
        this.router.navigate(['/profile']);
    }
}
