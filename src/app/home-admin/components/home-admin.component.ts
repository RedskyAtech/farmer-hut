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

    constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private userService: UserService) {
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

    ngOnInit(): void {
    }

    updateSlider() {
        this.isRenderingSlider = true;
        this.http
            .get(Values.BASE_URL + "files")
            .subscribe((res: any) => {
                if (res != null && res != undefined) {
                    if (res.isSuccess == true) {
                        this.userService.showLoadingState(false);
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
                this.userService.showLoadingState(false);
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
            this.router.navigate(['/similarProductAdmin']);
        }
    }

    onProfile() {
        this.router.navigate(['./profile']);
    }

    onProductEdit(product: Product) {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                "productId": product._id,
                "type": "edit"
            },
        };
        this.router.navigate(['./addProduct'], navigationExtras);
    }

    onCategoryEdit(category: Category) {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                "categoryId": category._id,
                "type": "edit"
            },
        };
        this.router.navigate(['./addCategory'], navigationExtras);
    }

    onAddProductButton() {
        if (this.tabSelectedIndex == 0) {
            this.router.navigate(['./addProduct']);
        }
        if (this.tabSelectedIndex == 1) {
            this.router.navigate(['./addCategory']);
        }
    }

    onAddSlider() {
        this.router.navigate(['./addSlider']);
    }

    onProductInactive(product: Product) {
        // this.userService.showLoadingState(true);





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

    onProductActive(product: Product) {
    //     this.userService.showLoadingState(true);
    //     var formBody: FormData = new FormData();
    //     formBody.append('status', 'enabled')
    //     this.http
    //         .put(Values.BASE_URL + "products/update/" + product._id, formBody)
    //         .subscribe((res: any) => {
    //             if (res != null && res != undefined) {
    //                 if (res.isSuccess == true) {
    //                     this.userService.showLoadingState(false);
    //                     this.products = [];
    //                     this.productCategories = [];
    //                     this.getProducts();
    //                 }
    //             }
    //         }, error => {
    //             alert(error.error.error);
    //         });
    }

    onCategoryInactive(category: Category) {
    //     // this.category.status = "inactive";
    //     this.userService.showLoadingState(true);
    //     var formBody: FormData = new FormData();
    //     formBody.append('status', 'inactive')
    //     this.http
    //         .put(Values.BASE_URL + "categories/update/" + category._id, formBody)
    //         .subscribe((res: any) => {
    //             if (res != null && res != undefined) {
    //                 if (res.isSuccess == true) {
    //                     this.userService.showLoadingState(false);
    //                     this.productCategories = [];
    //                     this.getCategories();
    //                 }
    //             }
    //         }, error => {
    //             alert(error.error.error);
    //         });
    }

    onCategoryActive(category: Category) {
        // this.userService.showLoadingState(true);
        // var formBody: FormData = new FormData();
        // formBody.append('status', 'active')
        // this.http
        //     .put(Values.BASE_URL + "categories/update/" + category._id, formBody)
        //     .subscribe((res: any) => {
        //         if (res != null && res != undefined) {
        //             if (res.isSuccess == true) {
        //                 this.userService.showLoadingState(false);
        //                 this.productCategories = [];
        //                 this.getCategories();
        //             }
        //         }
        //     }, error => {
        //         alert(error.error.error);
        //     });
    }

}
