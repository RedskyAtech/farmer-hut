import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
// import { RouterExtensions } from "nativescript-angular/router";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import { SelectedIndexChangedEventData } from "tns-core-modules/ui/tab-view";
import { Product } from "~/app/models/product.model";
import * as localstorage from "nativescript-localstorage";
import { HttpClient } from "@angular/common/http";
import { Values } from "~/app/values/values";
import { UserService } from "../../services/user.service";
import { Category } from "../../models/category.model";
import { session, Request } from 'nativescript-background-http';
import { Folder, path, knownFolders, File } from "tns-core-modules/file-system";
import { RouterExtensions } from "nativescript-angular/router";
import { NavigationService } from "~/app/services/navigation.service";

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

    constructor(private routerExtensions: RouterExtensions, private navigationService: NavigationService, private route: ActivatedRoute, private http: HttpClient, private userService: UserService) {
        this.addButtonText = "Add Product";
        this.product = new Product();
        this.products = [];
        this.category = new Category();
        this.sliderImage1 = "";
        this.sliderImage2 = "";
        this.sliderImage3 = "";
        this.sliderImage4 = "";
        this.selectedPage = 0;
        this.isRenderingProducts = false;
        this.isRenderingSlider = false;
        this.extension = "jpg";

        this.userService.showLoadingState(false);
        this.navigationService.backTo = undefined;

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
        this.route.queryParams.subscribe(params => {
            if (params["index"] == "1" && params["index"] != undefined) {
                this.tabSelectedIndex = 1;
                this.addButtonText = "Add Category";
            } else {
                this.tabSelectedIndex = 0;
                this.addButtonText = "Add Product";
            }
        });
        if (localstorage.getItem("adminToken") != null && localstorage.getItem("adminToken") != undefined && localstorage.getItem("adminId") != null && localstorage.getItem("adminId") != undefined) {
            this.userService.showLoadingState(true);
            this.getProducts();
        }
    }

    updateSlider() {
        this.http
            .get(Values.BASE_URL + "files")
            .subscribe((res: any) => {
                if (res != null && res != undefined) {
                    if (res.isSuccess == true) {
                        if (res.data[0].images[0].url) {
                            this.sliderImage1 = res.data[0].images[0].url;
                        }
                        if (res.data[0].images[1].url) {
                            this.sliderImage2 = res.data[0].images[1].url;
                        }
                        if (res.data[0].images[2].url) {
                            this.sliderImage3 = res.data[0].images[2].url;
                        }
                        if (res.data[0].images[3].url) {
                            this.sliderImage4 = res.data[0].images[3].url;
                        }
                        // this.pullRefreshPage.refreshing = false;
                    }
                }
            }, error => {
                console.log(error.error.error);
            });
    }

    getProducts() {
        this.http
            .get(Values.BASE_URL + "products")
            .subscribe((res: any) => {
                if (res != null && res != undefined) {
                    if (res.isSuccess == true) {
                        for (var i = this.products.length; i < res.data.length; i++) {
                            this.products.push({
                                _id: res.data[i]._id,
                                status: res.data[i].status,
                                image: res.data[i].image.url,
                                brandName: res.data[i].brand,
                                name: res.data[i].name,
                                weight: res.data[i].dimensions[0].value + " " + res.data[i].dimensions[0].unit,
                                price: "Rs " + res.data[i].price.value,
                            })
                        }
                        this.getCategories();
                    }
                }
            }, error => {
                this.userService.showLoadingState(false);
                alert(error.error.error);
            });
    }

    getCategories() {
        this.http
            .get(Values.BASE_URL + "categories")
            .subscribe((res: any) => {

                if (res != null && res != undefined) {
                    if (res.isSuccess == true) {
                        for (var i = 0; i < res.data.length; i++) {
                            this.productCategories.push({
                                _id: res.data[i]._id,
                                status: res.data[i].status,
                                image: res.data[i].image.url,
                                name: res.data[i].name,
                            })
                        }
                        this.isRenderingProducts = true;
                        this.userService.showLoadingState(false);
                        this.updateSlider();
                    }
                }
            }, error => {
                this.userService.showLoadingState(false);
                alert(error.error.error);
            });
    }

    onSelectedIndexChanged(args: SelectedIndexChangedEventData) {
        if (args.oldIndex !== -1) {
            const newIndex = args.newIndex;
            if (newIndex === 0) {
                // this.tabSelectedIndexResult = "Profile Tab (tabSelectedIndex = 0 )";
                this.tabSelectedIndex = 0;
                this.addButtonText = "Add Product";
            } else if (newIndex === 1) {
                // this.tabSelectedIndexResult = "Stats Tab (tabSelectedIndex = 1 )";
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
                clearHistory: true,
            });
        }
    }

    onProfile() {
        this.routerExtensions.navigate(['./profile'], {
            clearHistory: true,
        });
    }

    onProductEdit(product: Product) {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                "productId": product._id,
                "type": "edit"
            },
        };
        this.routerExtensions.navigate(['./addProduct'], {
            queryParams: {
                "productId": product._id,
                "type": "edit"
            },
            clearHistory: true
        });
    }

    onCategoryEdit(category: Category) {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                "categoryId": category._id,
                "type": "edit"
            },
        };
        this.routerExtensions.navigate(['./addCategory'], {
            queryParams: {
                "categoryId": category._id,
                "type": "edit"
            },
            clearHistory: true,
        });
    }

    onAddProductButton() {
        if (this.tabSelectedIndex == 0) {
            this.routerExtensions.navigate(['./addProduct'], {
                clearHistory: true,
            });
        }
        if (this.tabSelectedIndex == 1) {
            this.routerExtensions.navigate(['./addCategory'], {
                clearHistory: true,
            });
        }
    }

    onAddSlider() {
        this.routerExtensions.navigate(['./addSlider'], {
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
            that.userService.showLoadingState(false);
            that.products = [];
            that.productCategories = [];
            that.getProducts();
        }, 5000);


        // var formBody: FormData = new FormData();
        // formBody.append('status', 'disabled')
        // console.log(formBody);
        // let headers = {
        //     'Content-Type': 'application/multipart/form-data'
        // }

        // this.http
        //     .put(Values.BASE_URL + "products/update/" + product._id, formBody, { headers: headers })
        //     .subscribe((res: any) => {
        //         console.trace('RES:::', res)
        //         if (res != null && res != undefined) {
        //             if (res.isSuccess == true) {
        //                 this.userService.showLoadingState(false);
        //                 this.products = [];
        //                 this.productCategories = [];
        //                 this.getProducts();
        //             }
        //         }
        //     }, error => {
        //         this.userService.showLoadingState(false);
        //         console.log(error.error);
        //     });
    }

    respondedEvent(e) {
        // var that = this;
        console.log("RESPONSE: " + e.data);
        this.userService.showLoadingState(false);
    }

    errorEvent(e) {
        console.log("Error is: " + JSON.stringify(e));
    }

    completeEvent(e) {
        console.log("Completed :" + JSON.stringify(e));
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
            that.userService.showLoadingState(false);
            that.products = [];
            that.productCategories = [];
            that.getProducts();
        }, 5000);
    }

    onCategoryInactive(category: Category) {
        this.userService.showLoadingState(true);
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
            that.userService.showLoadingState(false);
            that.productCategories = [];
            that.getCategories();
        }, 5000);
    }

    onCategoryActive(category: Category) {
        this.userService.showLoadingState(true);
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
            that.userService.showLoadingState(false);
            that.productCategories = [];
            that.getCategories();
        }, 5000);
    }

}
