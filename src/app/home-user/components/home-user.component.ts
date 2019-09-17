import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { SelectedIndexChangedEventData } from "tns-core-modules/ui/tab-view";
import { Product } from "~/app/models/product.model";
import { Cart } from "~/app/models/cart.model";
import { HttpClient } from "@angular/common/http";
import { Values } from "~/app/values/values";
import { UserService } from '../../services/user.service';
import { Category } from "../../models/category.model";
import { RouterExtensions } from "nativescript-angular/router";
import { NavigationService } from "~/app/services/navigation.service";
import { Page } from "tns-core-modules/ui/page/page";
import { BackgroundHttpService } from "~/app/services/background.http.service";
import { Marker, MapView } from "nativescript-google-maps-sdk";

import * as localstorage from "nativescript-localstorage";
import * as Toast from 'nativescript-toast';
import * as Location from "nativescript-geolocation"


@Component({
    selector: "ns-homeUser",
    moduleId: module.id,
    templateUrl: "./home-user.component.html",
    styleUrls: ["./home-user.component.css"]
})

export class HomeUserComponent implements OnInit {

    selectedPage: number = 0;
    products;
    productCategories = [];
    sliderImage1: string;
    sliderImage2: string;
    sliderImage3: string;
    sliderImage4: string;
    isCartCount: boolean;
    product: Product;
    cart: Cart;
    cartCount: number;
    category: Category;
    tabSelectedIndex: number;
    isRenderingSlider: boolean;
    isRenderingTabView: boolean;
    pullRefreshPage;
    pageNo: number;



    latitude = -33.86;
    longitude = 151.20;
    zoom = 8;
    minZoom = 0;
    maxZoom = 22;
    bearing = 0;
    tilt = 0;
    padding = [40, 40, 40, 40];
    mapView: MapView;

    marker = new Marker();
    location = new Location.Location();
    mainInit = true;
    categoryPageNo = 1;
    categoryInit = true;
    isRendering: boolean;
    isLoading: boolean;

    constructor(private route: ActivatedRoute, private navigationService: NavigationService, private http: HttpClient, private userService: UserService, private routerExtensions: RouterExtensions, private page: Page, private backgroundHttpService: BackgroundHttpService) {
        this.page.actionBarHidden = true;

        this.sliderImage1 = "res://image_background";
        this.sliderImage2 = "res://image_background";
        this.sliderImage3 = "res://image_background";
        this.sliderImage4 = "res://image_background";
        this.isRenderingSlider = false;
        this.isRenderingTabView = false;
        this.product = new Product();
        this.cart = new Cart();
        this.cart.product = new Product();
        this.category = new Category();
        this.products = [];
        this.navigationService.backTo = undefined;
        this.pageNo = 1;
        this.isRendering = false;
        this.isLoading = false;

        this.userService.showLoadingState(false);

        this.route.queryParams.subscribe(params => {
            if (params["index"] == "1" && params["index"] != undefined) {
                this.tabSelectedIndex = 1;

            } else {
                this.tabSelectedIndex = 0;
            }
        });

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
        setTimeout(() => {
            this.isRendering = true;
        }, 50);
        if (localstorage.getItem("userToken") != null && localstorage.getItem("userToken") != undefined && localstorage.getItem("userId") != null && localstorage.getItem("userId") != undefined) {
            if (this.getProducts()) {
                if (this.getCategory()) {
                    this.updateSlider(1)
                }
                // this.updateCartCount();
            }
        }
    }




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
            this.getCategory();
        }
        this.categoryInit = false;
    }

    getProducts() {
        // this.isLoading = true;
        this.http
            .get(Values.BASE_URL + `products?status=enabled&pageNo=${this.pageNo}&items=5`)
            .subscribe((res: any) => {
                console.trace('RES:::', res.data)
                if (res != null && res != undefined) {
                    if (res.isSuccess == true && res.data && res.data.products) {
                        // this.isLoading = false;
                        for (var i = 0; i < res.data.products.length; i++) {
                            this.products.push({
                                _id: res.data.products[i]._id,
                                status: res.data.products[i].status,
                                image: res.data.products[i].image.resize_url,
                                brandName: res.data.products[i].brand,
                                heading: res.data.products[i].heading.title,
                                name: res.data.products[i].name,
                                weight: res.data.products[i].dimensions[0].value + " " + res.data.products[i].dimensions[0].unit,
                                price: "Rs " + res.data.products[i].price.value,
                            })
                        }
                        // if (localstorage.getItem("cartId") != null && localstorage.getItem("cartId")) {
                        //     this.getCategory();
                        // }
                        // this.pageNo = this.pageNo + 1;
                        // this.updateSlider(1);
                        this.isRenderingSlider = true;     //remove it
                        this.mainInit = true;
                    }
                }
            }, error => {
                // this.isLoading = false;
                this.userService.showLoadingState(false);
                // this.pullRefreshPage.refreshing = false;
                console.log(error.error.error);
            });
        return true
    }

    getCategory() {
        // this.isLoading = true;
        this.http
            .get(Values.BASE_URL + `categories?status=active&pageNo=${this.categoryPageNo}&items=8`)
            .subscribe((res: any) => {
                console.log('RES:::CATEGORY:::', res)
                if (res != null && res != undefined) {
                    if (res.isSuccess == true) {
                        // this.isLoading = false;
                        if (res.data && res.data.categories) {
                            for (var i = 0; i < res.data.categories.length; i++) {
                                this.productCategories.push({
                                    _id: res.data.categories[i]._id,
                                    image: res.data.categories[i].image.resize_url,
                                    name: res.data.categories[i].name,
                                })
                            }
                            this.isRenderingTabView = true;
                            this.categoryInit = true;
                        }
                    }
                }
            }, error => {
                // this.isLoading = false;
                this.userService.showLoadingState(false);
                // this.pullRefreshPage.refreshing = false;
                console.log(error.error.error);
            });

        return true;
    }

    onSelectedIndexChanged(args: SelectedIndexChangedEventData) {
        if (args.oldIndex !== -1) {
            const newIndex = args.newIndex;
            if (newIndex === 0) {
                // this.tabSelectedIndexResult = "Profile Tab (tabSelectedIndex = 0 )";
                this.tabSelectedIndex = 0;
            } else if (newIndex === 1) {
                // this.tabSelectedIndexResult = "Stats Tab (tabSelectedIndex = 1 )";
                this.tabSelectedIndex = 1;
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
                            this.userService.showLoadingState(false);
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
                    this.userService.showLoadingState(false);
                    // this.pullRefreshPage.refreshing = false;
                    console.log(error.error.error);
                });
        }
    }

    updateCartCount() {
        var storedCart = JSON.parse(localstorage.getItem('cart'));

        if (storedCart.products.length != 0) {
            this.isCartCount = true;
            this.cartCount = storedCart.products.length;
        }
    }

    onViewDetail(product: Product) {
        this.routerExtensions.navigate(['/productDetail'], {
            queryParams: {
                "productId": product._id,
            }
        });

    }

    onCategory(category: Category) {
        this.routerExtensions.navigate(['/similarProductUser'], {
            queryParams: {
                "categoryId": category._id,
            },
        });
    }

    onProfile() {
        this.routerExtensions.navigate(['/profile']);
    }

    onCartClick() {
        this.routerExtensions.navigate(['/cart']);
    }

    onAddCart(product: Product) {

        this.userService.showLoadingState(true);
        this.cart.product._id = product._id;
        console.log(product._id);

        var storedCart = JSON.parse(localstorage.getItem('cart'));

        if (storedCart.products.length != 0) {
            for (var i = 0; i < storedCart.products.length; i++) {
                if (product._id == storedCart.products[i]._id) {
                    var quantity = parseInt(storedCart.products[i].quantity) + 1;
                    this.cart.product.quantity = quantity.toString();
                    this.updateCart(storedCart._id);
                    break;
                }
                else {
                    this.cart.product.quantity = "1";
                    this.updateCart(storedCart._id);
                }
            }
        }
        else {
            this.cart.product.quantity = "1";
            this.updateCart(storedCart._id);
        }


        // this.http
        //     .get(Values.BASE_URL + "carts/" + localstorage.getItem("cartId"))
        //     .subscribe((res: any) => {
        //         if (res != null && res != undefined) {
        //             if (res.isSuccess == true) {
        //                 if (res.data.products.length != 0) {
        //                     for (var i = 0; i < res.data.products.length; i++) {
        //                         if (product._id == res.data.products[i]._id) {
        //                             var quantity = parseInt(res.data.products[i].quantity) + 1;
        //                             this.cart.product.quantity = quantity.toString();
        //                             this.updateCart();
        //                             break;
        //                         }
        //                         else {
        //                             this.cart.product.quantity = "1";
        //                             this.updateCart();
        //                         }
        //                     }
        //                 }
        //                 else {
        //                     this.cart.product.quantity = "1";
        //                     this.updateCart();
        //                 }
        //             }
        //         }
        //     }, error => {
        //         this.userService.showLoadingState(false);
        //         console.log(error.error.error);
        //     });















        // this.userService.showLoadingState(true);
        // this.cart.product._id = product._id;
        // console.log(product._id);
        // // console.log(localstorage.getItem("cartId"));
        // this.http
        //     .get(Values.BASE_URL + "carts/" + localstorage.getItem("cartId"))
        //     .subscribe((res: any) => {
        //         if (res != null && res != undefined) {
        //             if (res.isSuccess == true) {
        //                 if (res.data.products.length != 0) {
        //                     for (var i = 0; i < res.data.products.length; i++) {
        //                         if (product._id == res.data.products[i]._id) {
        //                             var quantity = parseInt(res.data.products[i].quantity) + 1;
        //                             this.cart.product.quantity = quantity.toString();
        //                             this.updateCart();
        //                             break;
        //                         }
        //                         else {
        //                             this.cart.product.quantity = "1";
        //                             this.updateCart();
        //                         }
        //                     }
        //                 }
        //                 else {
        //                     this.cart.product.quantity = "1";
        //                     this.updateCart();
        //                 }
        //             }
        //         }
        //     }, error => {
        //         this.userService.showLoadingState(false);
        //         console.log(error.error.error);showLoadingState
        //     });
    }

    updateCart(cardId: string) {
        this.backgroundHttpService
            .put(Values.BASE_URL + `carts/update/${cardId}`, {}, this.cart)
            .then((res: any) => {
                if (res != null && res != undefined) {
                    if (res.isSuccess == true) {
                        localstorage.setItem('cart', JSON.stringify(res.data));
                        Toast.makeText("Product is added to cart!!!", "long").show();
                        this.updateCartCount();
                    }
                }
            }, error => {
                console.log(error.error.error);
            });



        // this.userService.showLoadingState(true);
        // this.http
        //     .put(Values.BASE_URL + "carts/update/" + localstorage.getItem("cartId"), this.cart)
        //     .subscribe((res: any) => {
        //         if (res != null && res != undefined) {
        //             if (res.isSuccess == true) {
        //                 Toast.makeText("Product is added to cart!!!", "long").show();
        //                 this.updateCartCount();
        //             }
        //         }
        //     }, error => {
        //         this.userService.showLoadingState(false);
        //         console.log(error.error.error);
        //     });
    }

}
