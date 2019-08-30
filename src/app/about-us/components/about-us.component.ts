import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { NavigationService } from "~/app/services/navigation.service";

@Component({
    selector: "ns-aboutUs",
    moduleId: module.id,
    templateUrl: "./about-us.component.html",
    styleUrls: ["./about-us.component.css"]
})
export class AboutUsComponent implements OnInit {

    aboutUs: string;

    constructor(private routerExtensions: RouterExtensions, private navigationService: NavigationService) {
        this.navigationService.backTo = "profile";
        this.aboutUs = "hds jhgsda jhgdsj jhgsa gjsd gjga jdasgj gdjg sjdg hds jhgsda jhgdsj jhgsa gjsd gjga jdasgj gdjg sjdg hds jhgsda jhgdsj jhgsa gjsd gjga jdasgj gdjg sjdg hds jhgsda jhgdsj jhgsa gjsd gjga jdasgj gdjg sjdg hds jhgsda jhgdsj jhgsa gjsd gjga jdasgj gdjg sjdg hds jhgsda jhgdsj jhgsa gjsd gjga jdasgj gdjg sjdg hds jhgsda jhgdsj jhgsa gjsd gjga jdasgj gdjg sjdg hds jhgsda jhgdsj jhgsa gjsd gjga jdasgj gdjg sjdg hds jhgsda jhgdsj jhgsa gjsd gjga jdasgj gdjg sjdg hds jhgsda jhgdsj jhgsa gjsd gjga jdasgj gdjg sjdg hds jhgsda jhgdsj jhgsa gjsd gjga jdasgj gdjg sjdg hds jhgsda jhgdsj jhgsa gjsd gjga jdasgj gdjg sjdg hds jhgsda jhgdsj jhgsa gjsd gjga jdasgj gdjg sjdg hds jhgsda jhgdsj jhgsa gjsd gjga jdasgj gdjg sjdg hds jhgsda jhgdsj jhgsa gjsd gjga jdasgj gdjg sjdg hds jhgsda jhgdsj jhgsa gjsd gjga jdasgj gdjg sjdg hds jhgsda jhgdsj jhgsa gjsd gjga jdasgj gdjg sjdg hds jhgsda jhgdsj jhgsa gjsd gjga jdasgj gdjg sjdg hds jhgsda jhgdsj jhgsa gjsd gjga jdasgj gdjg sjdg hds jhgsda jhgdsj jhgsa gjsd gjga jdasgj gdjg sjdg hds jhgsda jhgdsj jhgsa gjsd gjga jdasgj gdjg sjdg hds jhgsda jhgdsj jhgsa gjsd gjga jdasgj gdjg sjdg hds jhgsda jhgdsj jhgsa gjsd gjga jdasgj gdjg sjdg hds jhgsda jhgdsj jhgsa gjsd gjga jdasgj gdjg sjdg";
    }

    ngOnInit(): void {
    }

    onBack() {
        this.routerExtensions.navigate(['./profile'], {
            clearHistory: true,
        });
    }
}
