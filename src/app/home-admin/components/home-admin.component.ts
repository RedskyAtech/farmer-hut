import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { SelectedIndexChangedEventData } from "tns-core-modules/ui/tab-view";
import { Product } from "~/app/models/product.model";
import { HttpClient } from "@angular/common/http";
import { Values } from "~/app/values/values";
import { UserService } from "../../services/user.service";
import { Category } from "../../models/category.model";
import { session } from 'nativescript-background-http';
import { RouterExtensions } from "nativescript-angular/router";
import { NavigationService } from "~/app/services/navigation.service";

import * as localstorage from "nativescript-localstorage";
import { Page } from "tns-core-modules/ui/page/page";


@Component({
    selector: "ns-homeAdmin",
    moduleId: module.id,
    templateUrl: "./home-admin.component.html",
    styleUrls: ["./home-admin.component.css"]
})

export class HomeAdminComponent implements OnInit {

    products;
    productCategories = [];
    tabSelectedIndex: number;
    addButtonText: string;
    product: Product;
    category: Category;
    sliderImage1: string;
    sliderImage2: string;
    sliderImage3: string;
    sliderImage4: string;
    selectedPage: number;
    isRenderingSlider: boolean;
    isRenderingProducts: boolean;
    file: any;
    name: string;
    extension: string;
    shouldImageUpdate: string;

    mainInit = true;
    pageNo: number;

    categoryPageNo = 1;
    categoryInit = true;
    isRendering: boolean;
    isLoading: boolean;
    fileId: string;

    constructor(private routerExtensions: RouterExtensions, private userService: UserService, private navigationService: NavigationService, private route: ActivatedRoute, private http: HttpClient, private page: Page) {
        this.page.actionBarHidden = true;
        this.addButtonText = "Add Product";
        this.product = new Product();
        this.products = [];
        this.category = new Category();
        this.sliderImage1 = "res://slider_background";
        this.sliderImage2 = "res://slider_background";
        this.sliderImage3 = "res://slider_background";
        this.sliderImage4 = "res://slider_background";
        this.selectedPage = 0;
        this.isRenderingProducts = false;
        this.isRenderingSlider = false;
        this.extension = "jpg";
        this.isLoading = false;
        this.isRendering = false;
        this.fileId = "";
        this.pageNo = 1;
        this.navigationService.backTo = undefined;
        this.tabSelectedIndex = 0;
        this.getFileId();

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

        this.page.on('navigatedTo', (data) => {
            console.log("ddata:::", data.isBackNavigation);
            console.log("navigating to this page:::", data.context);
            if (data.isBackNavigation) {
                this.userService.activeScreen("homeAdmin");
            }
        })

    }

    ngOnInit(): void {
        setTimeout(() => {
            this.isRendering = true;
        }, 50);

        if (localstorage.getItem("adminToken") != null && localstorage.getItem("adminToken") != undefined && localstorage.getItem("adminId") != null && localstorage.getItem("adminId") != undefined) {
            if (this.getProducts()) {
                if (this.getCategories()) {
                    this.updateSlider(1)
                }
            }
        }
    }

    getFileId() {
        this.http
            .get(Values.BASE_URL + "files")
            .subscribe((res: any) => {
                if (res != null && res != undefined) {
                    if (res.isSuccess == true) {
                        this.fileId = res.data[0]._id;
                        localstorage.setItem("fileId", this.fileId);
                    }
                }
            }, error => {
                console.log(error.error.error);
            });
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
                        // this.errorMessage = "May be your network connection is low.";
                        // this.warningDialog.show();
                        alert("Something went wrong!!! May be your network connection is low.");
                    }
                    else {
                        // this.errorMessage = error.error.error;
                        // this.warningDialog.show();
                        alert(error.error.error);
                    }
                });
        }
    }

    onLoadMoreMainItems() {
        if (!this.mainInit) {
            this.pageNo = this.pageNo + 1;
            this.getProducts();
        }
        this.mainInit = false;
    }

    onLoadMoreCategoryItems() {
        if (!this.categoryInit) {
            this.categoryPageNo = this.categoryPageNo + 1;
            this.getCategories();
        }
        this.categoryInit = false;
    }

    getProducts() {
        console.log('HOME:::PRO')
        this.http
            .get(Values.BASE_URL + `products?pageNo=${this.pageNo}&items=5`)
            .subscribe((res: any) => {
                if (res != null && res != undefined) {
                    if (res.isSuccess == true) {
                        for (var i = 0; i < res.data.products.length; i++) {
                            this.products.push({
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
                        this.mainInit = true;
                    }
                }
            }, error => {
                // this.isLoading = false;
                if (error.error.error == undefined) {
                    // this.errorMessage = "May be your network connection is low.";
                    // this.warningDialog.show();
                    alert("Something went wrong!!! May be your network connection is low.");
                }
                else {
                    // this.errorMessage = error.error.error;
                    // this.warningDialog.show();
                    alert(error.error.error);
                }
            });

        return true;
    }

    getCategories() {
        console.log('HOME:::CAT')
        this.http
            .get(Values.BASE_URL + `categories?pageNo=${this.categoryPageNo}&items=8`)
            .subscribe((res: any) => {

                if (res != null && res != undefined) {
                    if (res.isSuccess == true) {
                        for (var i = 0; i < res.data.categories.length; i++) {
                            this.productCategories.push({
                                _id: res.data.categories[i]._id,
                                status: res.data.categories[i].status,
                                image: res.data.categories[i].image.resize_url,
                                name: res.data.categories[i].name,
                            })
                        }
                        this.isRenderingProducts = true;
                        this.categoryInit = true;
                    }
                }
            }, error => {
                // this.isLoading = false;
                if (error.error.error == undefined) {
                    // this.errorMessage = "May be your network connection is low.";
                    // this.warningDialog.show();
                    alert("Something went wrong!!! May be your network connection is low.");
                }
                else {
                    // this.errorMessage = error.error.error;
                    // this.warningDialog.show();
                    alert(error.error.error);
                }
            });
        return true;
    }

    onSelectedIndexChanged(args: SelectedIndexChangedEventData) {
        if (args.oldIndex !== -1) {
            const newIndex = args.newIndex;
            if (newIndex === 0) {
                this.tabSelectedIndex = 0;
                this.addButtonText = "Add Product";
            } else if (newIndex === 1) {
                this.tabSelectedIndex = 1;
                this.addButtonText = "Add Category";
            }
        }
    }

    onCategory(category: Category) {
        if (category._id != undefined && category._id != null) {
            localstorage.removeItem("categoryId");
            localstorage.setItem('categoryId', category._id);


            this.routerExtensions.navigate(['/similarProductAdmin'], {
                queryParams: {
                    "categoryId": category._id,
                    "name": category.name
                },
            });
        }
    }

    onProfile() {
        this.routerExtensions.navigate(['./profile']);
    }

    onProductEdit(product: Product) {
        this.routerExtensions.navigate(['./addProduct'], {
            queryParams: {
                "product": JSON.stringify(product),
                "type": "edit"
            }
        });
    }

    onCategoryEdit(category: Category) {
        this.routerExtensions.navigate(['./addCategory'], {
            queryParams: {
                "categoryId": category._id,
                "type": "edit"
            }
        });
    }

    onAddProductButton() {
        if (this.tabSelectedIndex == 0) {
            this.routerExtensions.navigate(['./addProduct']);
        }
        if (this.tabSelectedIndex == 1) {
            this.routerExtensions.navigate(['./addCategory'])
        }
    }

    onAddSlider() {
        this.routerExtensions.navigate(['./addSlider']);
    }

    onProductInactive(product: Product) {

        var that = this;
        var productId = product._id;
        that.file = "/storage/emulated/0/farmersHut/FarmersHut.jpg";
        that.name = that.file.substr(that.file.lastIndexOf("/") + 1);
        that.extension = that.name.substr(that.name.lastIndexOf(".") + 1);
        var mimeType = "image/" + that.extension;
        var uploadSession = session('image-upload');
        var request = {
            url: Values.BASE_URL + "products",
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
        console.log(params);
        var task = uploadSession.multipartUpload(params, request);
        task.on("responded", this.respondedEvent);
        task.on("error", this.errorEvent);
        task.on("complete", this.completeEvent);

        setTimeout(() => {
            that.products = [];
            that.productCategories = [];
            that.getProducts();
        }, 5000);
    }

    respondedEvent(e) {
        // var that = this;
        console.log("RESPONSE: " + e.data);
    }

    errorEvent(e) {
        console.log("Error is: " + JSON.stringify(e));
    }

    completeEvent(e) {
        console.log("Completed :" + JSON.stringify(e));
    }

    onProductActive(product: Product) {
        var that = this;
        var productId = product._id;
        that.file = "/storage/emulated/0/farmersHut/FarmersHut.jpg";
        that.name = that.file.substr(that.file.lastIndexOf("/") + 1);
        that.extension = that.name.substr(that.name.lastIndexOf(".") + 1);
        var mimeType = "image/" + that.extension;
        var uploadSession = session('image-upload');
        var request = {
            url: Values.BASE_URL + "products",
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
        console.log(params);
        var task = uploadSession.multipartUpload(params, request);
        task.on("responded", this.respondedEvent);
        task.on("error", this.errorEvent);
        task.on("complete", this.completeEvent);

        setTimeout(() => {
            that.products = [];
            that.productCategories = [];
            that.getProducts();
        }, 5000);
    }

    onCategoryInactive(category: Category) {
        var that = this;
        var categoryId = category._id;
        that.file = "/storage/emulated/0/farmersHut/FarmersHut.jpg";
        that.name = that.file.substr(that.file.lastIndexOf("/") + 1);
        that.extension = that.name.substr(that.name.lastIndexOf(".") + 1);
        var mimeType = "image/" + that.extension;
        var uploadSession = session('image-upload');
        var request = {
            url: Values.BASE_URL + "categories",
            method: "POST",
            headers: {
                "Content-Type": "application/octet-stream",
                "File-Name": that.name
            },
            description: "{'uploading':" + that.name + "}"
        }
        const params = [
            { name: "file", filename: that.file, mimeType: mimeType },
            { name: "status", value: "inactive" },
            { name: "shouldImageUpdate", value: "false" },
            { name: "isUpdate", value: "true" },
            { name: "category_id", value: categoryId }
        ]
        console.log(params);
        var task = uploadSession.multipartUpload(params, request);
        task.on("responded", this.respondedEvent);
        task.on("error", this.errorEvent);
        task.on("complete", this.completeEvent);

        setTimeout(() => {
            that.productCategories = [];
            that.getCategories();
        }, 5000);
    }

    onCategoryActive(category: Category) {
        var that = this;
        var categoryId = category._id;
        that.file = "/storage/emulated/0/farmersHut/FarmersHut.jpg";
        that.name = that.file.substr(that.file.lastIndexOf("/") + 1);
        that.extension = that.name.substr(that.name.lastIndexOf(".") + 1);
        var mimeType = "image/" + that.extension;
        var uploadSession = session('image-upload');
        var request = {
            url: Values.BASE_URL + "categories",
            method: "POST",
            headers: {
                "Content-Type": "application/octet-stream",
                "File-Name": that.name
            },
            description: "{'uploading':" + that.name + "}"
        }
        const params = [
            { name: "file", filename: that.file, mimeType: mimeType },
            { name: "status", value: "active" },
            { name: "shouldImageUpdate", value: "false" },
            { name: "isUpdate", value: "true" },
            { name: "category_id", value: categoryId }
        ]
        console.log(params);
        var task = uploadSession.multipartUpload(params, request);
        task.on("responded", this.respondedEvent);
        task.on("error", this.errorEvent);
        task.on("complete", this.completeEvent);

        setTimeout(() => {
            that.productCategories = [];
            that.getCategories();
        }, 5000);
    }

}
