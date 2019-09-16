import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { NavigationService } from "~/app/services/navigation.service";
import { UserService } from "~/app/services/user.service";
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

    constructor(private routerExtensions: RouterExtensions, private navigationService: NavigationService, private userService: UserService, private http: HttpClient, private page: Page) {
        this.isRendering = false;
        this.page.actionBarHidden = true;
        this.navigationService.backTo = "profile";
        this.getAbout();
        // this.aboutUs = "hds jhgsda jhgdsj jhgsa gjsd gjga jdasgj gdjg sjdg hds jhgsda jhgdsj jhgsa gjsd gjga jdasgj gdjg sjdg hds jhgsda jhgdsj jhgsa gjsd gjga jdasgj gdjg sjdg hds jhgsda jhgdsj jhgsa gjsd gjga jdasgj gdjg sjdg hds jhgsda jhgdsj jhgsa gjsd gjga jdasgj gdjg sjdg hds jhgsda jhgdsj jhgsa gjsd gjga jdasgj gdjg sjdg hds jhgsda jhgdsj jhgsa gjsd gjga jdasgj gdjg sjdg hds jhgsda jhgdsj jhgsa gjsd gjga jdasgj gdjg sjdg hds jhgsda jhgdsj jhgsa gjsd gjga jdasgj gdjg sjdg hds jhgsda jhgdsj jhgsa gjsd gjga jdasgj gdjg sjdg hds jhgsda jhgdsj jhgsa gjsd gjga jdasgj gdjg sjdg hds jhgsda jhgdsj jhgsa gjsd gjga jdasgj gdjg sjdg hds jhgsda jhgdsj jhgsa gjsd gjga jdasgj gdjg sjdg hds jhgsda jhgdsj jhgsa gjsd gjga jdasgj gdjg sjdg hds jhgsda jhgdsj jhgsa gjsd gjga jdasgj gdjg sjdg hds jhgsda jhgdsj jhgsa gjsd gjga jdasgj gdjg sjdg hds jhgsda jhgdsj jhgsa gjsd gjga jdasgj gdjg sjdg hds jhgsda jhgdsj jhgsa gjsd gjga jdasgj gdjg sjdg hds jhgsda jhgdsj jhgsa gjsd gjga jdasgj gdjg sjdg hds jhgsda jhgdsj jhgsa gjsd gjga jdasgj gdjg sjdg hds jhgsda jhgdsj jhgsa gjsd gjga jdasgj gdjg sjdg hds jhgsda jhgdsj jhgsa gjsd gjga jdasgj gdjg sjdg hds jhgsda jhgdsj jhgsa gjsd gjga jdasgj gdjg sjdg hds jhgsda jhgdsj jhgsa gjsd gjga jdasgj gdjg sjdg";
    }

    ngOnInit(): void {
    }

    getAbout() {
        this.http
            .get(Values.BASE_URL + "aboutUs")
            .subscribe((res: any) => {
                if (res != null && res != undefined) {
                    if (res.isSuccess == true) {
                        this.aboutUs = res.data[0].description;
                    }
                }
            }, error => {
                alert(error.error.error);
            });
    }

    onBack() {
        // this.routerExtensions.navigate(['./profile'], {
        //     clearHistory: true,
        // });
        this.routerExtensions.back();

    }
}
