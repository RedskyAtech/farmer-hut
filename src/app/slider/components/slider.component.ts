import { Component, OnInit, Input } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Values } from "~/app/values/values";
import { Page } from "tns-core-modules/ui/page/page";

import * as localstorage from "nativescript-localstorage";


@Component({
    selector: "ns-slider",
    moduleId: module.id,
    templateUrl: "./slider.component.html",
    styleUrls: ["./slider.component.css"]
})

export class SliderComponent implements OnInit {

    @Input() width: string;
    @Input() height: string;

    selectedPage: number = 0;
    sliderImage1: string;
    sliderImage2: string;
    sliderImage3: string;
    sliderImage4: string;
    isRenderingSlider: boolean;



    constructor(private http: HttpClient, private page: Page) {
        this.page.actionBarHidden = true;

        this.sliderImage1 = "res://slider_background";
        this.sliderImage2 = "res://slider_background";
        this.sliderImage3 = "res://slider_background";
        this.sliderImage4 = "res://slider_background";
        this.isRenderingSlider = false;

        setInterval(() => {
            setTimeout(() => {
                this.selectedPage++;
            }, 6000)
            if (this.selectedPage == 3) {
                setTimeout(() => {
                    this.selectedPage = 0;
                }, 6000);
            }
        }, 6000);

    }

    ngOnInit(): void {
        if ((localstorage.getItem("adminToken") != null && localstorage.getItem("adminToken") != undefined && localstorage.getItem("adminId") != null && localstorage.getItem("adminId") != undefined) || (localstorage.getItem("userToken") != null && localstorage.getItem("userToken") != undefined && localstorage.getItem("userId") != null && localstorage.getItem("userId") != undefined)) {
            this.updateSlider(1)
        }
    }

    updateSlider(count: number) {
        if (count > 0 && count < 5) {
            this.isRenderingSlider = true;
            this.http
                .get(Values.BASE_URL + `files?pageNo=${0}&items=${count}`)
                .subscribe((res: any) => {
                    if (res != null && res != undefined) {
                        if (res.isSuccess == true) {
                            switch (count) {
                                case 1:
                                    this.sliderImage1 = res.data.resize_url;
                                    break;
                                case 2:
                                    this.sliderImage2 = res.data.resize_url;
                                    break;
                                case 3:
                                    this.sliderImage3 = res.data.resize_url;
                                    break;
                                case 4:
                                    this.sliderImage4 = res.data.resize_url;
                                    break;
                            }
                            if (count + 1 < 5) {
                                this.updateSlider(count + 1)
                            }
                        }
                    }
                }, error => {
                    if (error.error.error == undefined) {
                        alert("Something went wrong!!! May be your network connection is low.");
                    }
                    else {
                        alert(error.error.error);
                    }
                });
        }
    }

}
