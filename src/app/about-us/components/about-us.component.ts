import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { NavigationService } from "~/app/services/navigation.service";
import { HttpClient } from "@angular/common/http";
import { Values } from "~/app/values/values";
import { Page } from "tns-core-modules/ui/page/page";

@Component({
    selector: "ns-aboutUs",
    moduleId: module.id,
    templateUrl: "./about-us.component.html",
    styleUrls: ["./about-us.component.css"]
})
export class AboutUsComponent implements OnInit {

    aboutUs: string;
    isRendering: boolean;
    isLoading: boolean;
    constructor(private routerExtensions: RouterExtensions, private navigationService: NavigationService, private http: HttpClient, private page: Page) {
        this.isRendering = false;
        this.page.actionBarHidden = true;
        this.navigationService.backTo = "profile";
        this.getAbout();
    }

    ngOnInit(): void {
        this.isLoading = false;
    }

    getAbout() {
        this.isLoading = true;
        this.http
            .get(Values.BASE_URL + "aboutUs")
            .subscribe((res: any) => {
                if (res != null && res != undefined) {
                    if (res.isSuccess == true) {
                        this.isLoading = false;
                        this.aboutUs = res.data[0].description;
                    }
                }
            }, error => {
                this.isLoading = false;
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
