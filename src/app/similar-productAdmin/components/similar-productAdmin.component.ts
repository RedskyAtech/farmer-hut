import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
// import { RouterExtensions } from "nativescript-angular/router";
import { Router, NavigationExtras } from "@angular/router";
import { SelectedIndexChangedEventData } from "tns-core-modules/ui/tab-view";
import { Product } from "~/app/models/product.model";
import * as localstorage from "nativescript-localstorage";
import { UserService } from "../../services/user.service";
import { Values } from "~/app/values/values";
import { HttpClient } from "@angular/common/http";
import { session, Request } from 'nativescript-background-http';
import { RouterExtensions } from "nativescript-angular/router";
import { NavigationService } from "~/app/services/navigation.service";

@Component({
    selector: "ns-similarProducts",
    moduleId: module.id,
    templateUrl: "./similar-productAdmin.component.html",
    styleUrls: ["./similar-productAdmin.component.css"]
})

export class SimilarProductAdminComponent implements OnInit {

    similarProducts = [];
    product: Product;
    file: any;
    name: string;
    extension: string;
    shouldImageUpdate: string;

    constructor(private routerExtensions: RouterExtensions, private navigationService: NavigationService, private userService: UserService, private http: HttpClient) {
        this.product = new Product();
        this.extension = "jpg";
        this.userService.showLoadingState(false);
        if (localstorage.getItem("adminToken") != null && localstorage.getItem("adminToken") != undefined && localstorage.getItem("adminId") != null && localstorage.getItem("adminId") != undefined) {
            this.getSimilarProducts();
        }
        this.navigationService.backTo = "homeAdmin";
    }

    ngOnInit(): void {
    }

    getSimilarProducts() {
        if (localstorage.getItem("categoryId") != null && localstorage.getItem("categoryId") != undefined) {
            this.userService.showLoadingState(true);
            this.http
                .get(Values.BASE_URL + "similarProducts?_id=" + localstorage.getItem("categoryId"))
                .subscribe((res: any) => {
                    if (res != null && res != undefined) {
                        if (res.isSuccess == true) {
                            this.userService.showLoadingState(false);
                            for (var i = 0; i < res.data.length; i++) {
                                this.similarProducts.push({
                                    _id: res.data[i]._id,
                                    status: res.data[i].status,
                                    image: res.data[i].image.url,
                                    brandName: res.data[i].brand,
                                    name: res.data[i].name,
                                    weight: res.data[i].dimensions[0].value + " " + res.data[i].dimensions[0].unit,
                                    price: "Rs " + res.data[i].price.value,
                                })
                            }
                        }
                    }
                }, error => {
                    this.userService.showLoadingState(false);
                    alert(error.error.error);
                });
        }
    }

    onEdit(product: Product) {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                "similarProductId": product._id,
                "classType": "similarProduct",
                "type": "edit"
            },
        };
        this.routerExtensions.navigate(['./addProduct'], {
            queryParams: {
                "similarProductId": product._id,
                "classType": "similarProduct",
                "type": "edit"
            },
            clearHistory: true,
        });
    }

    onBack() {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                "index": "1"
            },
        };
        this.routerExtensions.navigate(['./homeAdmin'], {
            queryParams: {
                "index": "1"
            },
            clearHistory: true,
        });
    }

    onAddButton() {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                "classType": "similarProduct"
            },
        };
        this.routerExtensions.navigate(['./addProduct'], {
            queryParams: {
                "classType": "similarProduct"
            },
            clearHistory: true,
        });
    }

    onProductInactive(product: Product) {
        this.userService.showLoadingState(true);
        var that = this;
        var productId = product._id;
        that.file = "/storage/emulated/0/farmersHut/FarmersHut.jpg";
        that.name = that.file.substr(that.file.lastIndexOf("/") + 1);
        that.extension = that.name.substr(that.name.lastIndexOf(".") + 1);
        var mimeType = "image/" + that.extension;
        var uploadSession = session('image-upload');
        var request = {
            url: Values.BASE_URL + "similarProducts",
            method: "POST",
            headers: {
                "Content-Type": "application/octet-stream",
                "File-Name": that.name
            },
            description: "{'uploading':" + that.name + "}"
        }
        const params = [
            { name: "file", filename: that.file, mimeType: mimeType },
            { name: "status", value: "disabled" },
            { name: "shouldImageUpdate", value: "false" },
            { name: "isUpdate", value: "true" },
            { name: "product_id", value: productId }
        ]
        var task = uploadSession.multipartUpload(params, request);
        task.on("responded", this.respondedEvent);
        task.on("error", this.errorEvent);
        task.on("complete", this.completeEvent);

        setTimeout(() => {
            that.userService.showLoadingState(false);
            that.similarProducts = [];
            that.getSimilarProducts();
        }, 5000);
    }

    onProductActive(product: Product) {
        this.userService.showLoadingState(true);
        var that = this;
        var productId = product._id;
        that.file = "/storage/emulated/0/farmersHut/FarmersHut.jpg";
        that.name = that.file.substr(that.file.lastIndexOf("/") + 1);
        that.extension = that.name.substr(that.name.lastIndexOf(".") + 1);
        var mimeType = "image/" + that.extension;
        var uploadSession = session('image-upload');
        var request = {
            url: Values.BASE_URL + "similarProducts",
            method: "POST",
            headers: {
                "Content-Type": "application/octet-stream",
                "File-Name": that.name
            },
            description: "{'uploading':" + that.name + "}"
        }
        const params = [
            { name: "file", filename: that.file, mimeType: mimeType },
            { name: "status", value: "enabled" },
            { name: "shouldImageUpdate", value: "false" },
            { name: "isUpdate", value: "true" },
            { name: "product_id", value: productId }
        ]
        var task = uploadSession.multipartUpload(params, request);
        task.on("responded", this.respondedEvent);
        task.on("error", this.errorEvent);
        task.on("complete", this.completeEvent);

        setTimeout(() => {
            that.userService.showLoadingState(false);
            that.similarProducts = [];
            that.getSimilarProducts();
        }, 5000);
    }

    respondedEvent(e) {
        console.log("RESPONSE: " + e.data);
    }

    errorEvent(e) {
        console.log("Error is: " + JSON.stringify(e));
    }

    completeEvent(e) {
        console.log("Completed :" + JSON.stringify(e));
    }
}
