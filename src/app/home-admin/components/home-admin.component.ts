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

    constructor(private routerExtensions: RouterExtensions, private navigationService: NavigationService, private route: ActivatedRoute, private http: HttpClient, private page: Page) {
        this.page.actionBarHidden = true;
        console.log('HOME')
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

        this.pageNo = 1;

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
            if (this.getProducts()) {
                if (this.getCategories()) {
                    this.updateSlider(1)
                }
                // this.updateCartCount();
            }
        }
    }




    updateSlider(count: number) {
        if (count > 0 && count < 5) {
            this.isRenderingSlider = true;
            this.http
                .get(Values.BASE_URL + `files?pageNo=${count}&items=1`)
                .subscribe((res: any) => {
                    if (res != null && res != undefined) {
                        if (res.isSuccess == true) {
                            switch (count) {
                                case 1:
                                    this.sliderImage1 = res.data.url;
                                    break;
                                case 2:
                                    this.sliderImage2 = res.data.url;
                                    break;
                                case 3:
                                    this.sliderImage3 = res.data.url;
                                    break;
                                case 4:
                                    this.sliderImage4 = res.data.url;
                                    break;
                            }
                            if (count + 1 < 5) {
                                this.updateSlider(count + 1)
                            }
                            // this.sliderImage1 = res.data.url;
                            // this.sliderImage2 = res.data[0].images[1].url;
                            // this.sliderImage3 = res.data[0].images[2].url;
                            // this.sliderImage4 = res.data[0].images[3].url;
                        }
                        // this.pullRefreshPage.refreshing = false;
                    }
                }, error => {
                    // this.pullRefreshPage.refreshing = false;
                    console.log(error.error.error);
                });
        }
    }

    // updateSlider() {
    //     this.http
    //         .get(Values.BASE_URL + "files")
    //         .subscribe((res: any) => {
    //             if (res != null && res != undefined) {
    //                 if (res.isSuccess == true) {
    //                     if (res.data[0].images[0].url) {
    //                         this.sliderImage1 = res.data[0].images[0].url;
    //                     }
    //                     if (res.data[0].images[1].url) {
    //                         this.sliderImage2 = res.data[0].images[1].url;
    //                     }
    //                     if (res.data[0].images[2].url) {
    //                         this.sliderImage3 = res.data[0].images[2].url;
    //                     }
    //                     if (res.data[0].images[3].url) {
    //                         this.sliderImage4 = res.data[0].images[3].url;
    //                     }
    //                     // this.pullRefreshPage.refreshing = false;
    //                 }
    //             }
    //         }, error => {
    //             console.log(error.error.error);
    //         });
    // }


    onLoadMoreMainItems() {
        console.log("111")
        if (!this.mainInit) {
            this.pageNo = this.pageNo + 1;
            this.getProducts();
        }
        this.mainInit = false;
    }

    onLoadMoreCategoryItems() {
        console.log("111")
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
                console.log("RES:::ADMIN", res)
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
                                price: "Rs " + res.data.products[i].price.value,
                            })
                        }
                        // this.getCategories();
                        // this.isRenderingProducts = true;
                        this.mainInit = true;
                    }
                }
            }, error => {
                alert(error.error.error);
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
                        // this.updateSlider();
                        this.categoryInit = true;
                    }
                    // this.isRenderingProducts = true;
                }
            }, error => {
                alert(error.error.error);
            });
        return true;
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
            this.routerExtensions.navigate(['/similarProductAdmin']);
        }
    }

    onProfile() {
        this.routerExtensions.navigate(['./profile']);
    }

    onProductEdit(product: Product) {
        this.routerExtensions.navigate(['./addProduct'], {
            queryParams: {
                "productId": product._id,
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
