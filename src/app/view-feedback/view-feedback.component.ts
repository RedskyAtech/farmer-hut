import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import { Product } from "../models/product";
import * as localstorage from "nativescript-localstorage";
import { HttpClient } from "@angular/common/http";
import { Values } from "~/app/values/values";
import { UserService } from '../services/user.service';

@Component({
    selector: "ns-viewFeedback",
    moduleId: module.id,
    templateUrl: "./view-feedback.component.html",
    styleUrls: ["./view-feedback.component.css"]
})

export class ViewFeedbackComponent implements OnInit {

    feedbacks;

    constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private userService: UserService) {
        this.feedbacks = [];
        if (localstorage.getItem("adminToken") != null &&
            localstorage.getItem("adminToken") != undefined &&
            localstorage.getItem("adminId") != null &&
            localstorage.getItem("adminId") != undefined) {
            this.userService.showLoadingState(true);
            this.http
                .get(Values.BASE_URL + "feedbacks")
                .subscribe((res: any) => {
                    if (res != null && res != undefined) {
                        if (res.isSuccess == true) {
                            this.userService.showLoadingState(false);
                            for (var i = 0; i < res.data.length; i++) {
                                this.feedbacks.push({
                                    _id: res.data[i]._id,
                                    name: res.data[i].name,
                                    message: res.data[i].message
                                })
                            }
                        }
                    }
                }, error => {
                    this.userService.showLoadingState(false);
                    console.log(error.error.error);
                });
        }
    }

    ngOnInit(): void {
    }

    onBack() {
        this.router.navigate(['/profile']);
    }
}
