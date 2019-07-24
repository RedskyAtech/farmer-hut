import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import * as imagepicker from "nativescript-imagepicker";

@Component({
    selector: "ns-addSlider",
    moduleId: module.id,
    templateUrl: "./add-slider.component.html",
    styleUrls: ["./add-slider.component.css"]
})

export class AddSliderComponent implements OnInit {

    sliderImage: string = "res://image_icon";

    constructor(private route: ActivatedRoute, private router: Router) {

    }

    ngOnInit(): void {
    }

    onBack() {
        this.router.navigate(['/homeAdmin']);
    }

    onUploadImage() {
        var that = this;
        let context = imagepicker.create({
            mode: "single"
        });
        context
            .authorize()
            .then(() => {
                return context.present();
            })
            .then(selection => {
                selection.forEach(function (selected) {
                    var path = selected.android.toString();
                    that.sliderImage = path;
                });
            });
    }

    onAddToSlider() {
        this.router.navigate(['./homeAdmin']);
    }
}
