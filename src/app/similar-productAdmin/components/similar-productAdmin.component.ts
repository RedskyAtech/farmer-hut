import { Component, OnInit } from "@angular/core";
import { Product } from "~/app/models/product.model";
import { UserService } from "../../services/user.service";
import { Values } from "~/app/values/values";
import { HttpClient } from "@angular/common/http";
import { session } from 'nativescript-background-http';
import { RouterExtensions } from "nativescript-angular/router";
import { NavigationService } from "~/app/services/navigation.service";
import { Page } from "tns-core-modules/ui/page/page";
import { ActivatedRoute } from "@angular/router";
import { GridView } from "nativescript-grid-view";

import * as localstorage from "nativescript-localstorage";

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
    heading: string;
    categoryId: string;

    similarPageNo = 1;
    similarInit = true;
    isRendering: boolean;
    isLoading: boolean;

    similarGridView: GridView;

    constructor(private routerExtensions: RouterExtensions, private router: ActivatedRoute, private page: Page, private navigationService: NavigationService, private userService: UserService, private http: HttpClient) {
        this.page.actionBarHidden = true;
        this.product = new Product();
        this.userService.activeScreen('');
        this.extension = "jpg";
        this.userService.showLoadingState(false);
        this.heading = "";
        this.categoryId = "";

        this.page.on('navigatedTo', (data) => {
            console.log("ddata:::", data.isBackNavigation);
            console.log("navigating to this page:::", data.context);
            if (data.isBackNavigation) {
                this.similarPageNo = 1;
                this.heading = localstorage.getItem("categoryHeading");
                if (localStorage.getItem('fromSimilarProducts') == 'true') {
                    this.page.requestLayout();
                    this.similarGridView.refresh();
                    this.similarProducts = [];
                    this.categoryId = localstorage.getItem("categoryId");
                    localStorage.setItem('fromSimilarProducts', '');
                    this.getSimilarProducts();
                }
            }
        })

        this.router.queryParams.subscribe((params) => {
            this.heading = params['name'];
            this.categoryId = params['categoryId'];
        })

        if (localstorage.getItem("adminToken") != null && localstorage.getItem("adminToken") != undefined && localstorage.getItem("adminId") != null && localstorage.getItem("adminId") != undefined) {
            if (localstorage.getItem("categoryId") != null && localstorage.getItem("categoryId") != undefined) {
                this.categoryId = localstorage.getItem("categoryId");
                this.heading = localstorage.getItem("categoryHeading");

                console.log("idddddddd::::::::", this.categoryId);
            }
            this.getSimilarProducts();
        }
        this.navigationService.backTo = "homeAdmin";
        this.isLoading = false;
        this.isRendering = false;
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.isRendering = true;
        }, 50);
    }

    onSimilarGridLoaded(args: any) {
        this.similarGridView = <GridView>args.object;
    }

    onLoadMoreSimilarItems() {
        if (!this.similarInit) {
            this.similarPageNo = this.similarPageNo + 1;
            this.getSimilarProducts();
        }
        this.similarInit = false;
    }

    getSimilarProducts() {
        if (this.categoryId != null && this.categoryId != undefined) {
            localstorage.setItem("categoryId", this.categoryId);
            localstorage.setItem("categoryHeading", this.heading);
            console.log('Category:::', this.categoryId)
            this.userService.showLoadingState(true);

            this.http
                .get(Values.BASE_URL + "similarProducts?_id=" + this.categoryId + `&pageNo=${this.similarPageNo}&items=10`)
                .subscribe((res: any) => {
                    if (res != null && res != undefined) {
                        if (res.isSuccess == true) {
                            console.trace("RES:::SIMILAR:::", res)
                            this.userService.showLoadingState(false);
                            for (var i = 0; i < res.data.products.length; i++) {
                                this.similarProducts.push({
                                    _id: res.data.products[i]._id,
                                    status: res.data.products[i].status,
                                    image: res.data.products[i].image.resize_url,
                                    brandName: res.data.products[i].brand,
                                    name: res.data.products[i].name,
                                    weight: res.data.products[i].dimensions[0].value + " " + res.data.products[i].dimensions[0].unit,
                                    weightUnit: res.data.products[i].dimensions[0].unit,
                                    weightValue: res.data.products[i].dimensions[0].value,
                                    price: res.data.products[i].price.value,
                                    heading: res.data.products[i].heading.title,
                                    description: res.data.products[i].heading.description
                                })
                            }
                            this.similarInit = true;
                        }
                    }
                }, error => {
                    this.userService.showLoadingState(false);
                    if (error.error.error == undefined) {
                        alert("Something went wrong!!! May be your network connection is low.");
                    }
                    else {
                        alert(error.error.error);
                    }
                });
        }
    }

    onEdit(product: Product) {
        this.routerExtensions.navigate(['./addProduct'], {
            queryParams: {
                "similarProduct": JSON.stringify(product),
                "classType": "similarProduct",
                "type": "edit"
            },
        });
    }

    onBack() {
        this.routerExtensions.back();
    }

    onAddButton() {
        this.routerExtensions.navigate(['./addProduct'], {
            queryParams: {
                "classType": "similarProduct"
            },
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
