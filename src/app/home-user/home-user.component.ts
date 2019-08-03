import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
// import { RouterExtensions } from "nativescript-angular/router";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import { SelectedIndexChangedEventData } from "tns-core-modules/ui/tab-view";
import { Product } from "~/app/models/product.model";
import { Cart } from "~/app/models/cart.model";
import * as localstorage from "nativescript-localstorage";
import { HttpClient } from "@angular/common/http";
import { Values } from "~/app/values/values";
import { UserService } from '../services/user.service';
import * as Toast from 'nativescript-toast';
import { Category } from "../models/category.model";

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

    constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private userService: UserService) {
        this.sliderImage1 = "";
        this.sliderImage2 = "";
        this.sliderImage3 = "";
        this.sliderImage4 = "";
        this.isRenderingSlider = false;
        this.isRenderingTabView = false;
        this.product = new Product();
        this.cart = new Cart();
        this.cart.product = new Product();
        this.category = new Category();
        this.products = [];

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

        if (localstorage.getItem("userToken") != null && localstorage.getItem("userToken") != undefined && localstorage.getItem("userId") != null && localstorage.getItem("userId") != undefined) {
            this.userService.showLoadingState(true);
            this.getProducts();
        }

    }

    refreshPage(args) {
        this.pullRefreshPage = args.object;
        this.pullRefreshPage.refreshing = true;
        this.getProducts();
    }

    ngOnInit(): void {
    }

    getProducts() {
        this.http
            .get(Values.BASE_URL + "products?status=enabled")
            .subscribe((res: any) => {
                if (res != null && res != undefined) {
                    if (res.isSuccess == true) {
                        for (var i = 0; i < res.data.length; i++) {
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
                        if (localstorage.getItem("cartId") != null && localstorage.getItem("cartId")) {
                            this.getCategory();
                        }
                    }
                }
            }, error => {
                this.userService.showLoadingState(false);
                this.pullRefreshPage.refreshing = false;
                console.log(error.error.error);
            });
    }

    getCategory() {
        this.http
            .get(Values.BASE_URL + "categories?status=active")
            .subscribe((res: any) => {
                if (res != null && res != undefined) {
                    if (res.isSuccess == true) {
                        for (var i = 0; i < res.data.length; i++) {
                            this.productCategories.push({
                                _id: res.data[i]._id,
                                image: res.data[i].image.url,
                                name: res.data[i].name,
                            })
                        }
                        this.isRenderingTabView = true;
                        this.updateCartCount();
                    }
                }
            }, error => {
                this.userService.showLoadingState(false);
                this.pullRefreshPage.refreshing = false;
                console.log(error.error.error);
            });
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

    updateSlider() {
        this.http
            .get(Values.BASE_URL + "files")
            .subscribe((res: any) => {
                if (res != null && res != undefined) {
                    if (res.isSuccess == true) {
                        this.userService.showLoadingState(false);
                        this.isRenderingSlider = true;
                        this.sliderImage1 = res.data[0].images[0].url;
                        this.sliderImage2 = res.data[0].images[1].url;
                        this.sliderImage3 = res.data[0].images[2].url;
                        this.sliderImage4 = res.data[0].images[3].url;
                    }
                    this.pullRefreshPage.refreshing = false;
                }
            }, error => {
                this.userService.showLoadingState(false);
                this.pullRefreshPage.refreshing = false;
                console.log(error.error.error);
            });
    }

    updateCartCount() {
        this.http
            .get(Values.BASE_URL + "carts/" + localstorage.getItem("cartId"))
            .subscribe((res: any) => {
                if (res != null && res != undefined) {
                    if (res.isSuccess == true) {
                        if (res.data.products.length != 0) {
                            console.log(res.data.products.length);
                            this.isCartCount = true;
                            this.cartCount = res.data.products.length;
                        }
                        this.updateSlider();
                    }
                }
            }, error => {
                this.userService.showLoadingState(false);
                this.pullRefreshPage.refreshing = false;
                console.log(error.error.error);
            });
    }

    onViewDetail(product: Product) {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                "productId": product._id,
            },
        };
        this.router.navigate(['/productDetail'], navigationExtras);
    }

    onCategory(category: Category) {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                "categoryId": category._id,
            },
        };
        this.router.navigate(['/similarProductUser'], navigationExtras);
    }

    onProfile() {
        this.router.navigate(['/profile']);
    }

    onCartClick() {
        this.router.navigate(['/cart']);
    }

    onAddCart(product: Product) {
        this.userService.showLoadingState(true);
        this.cart.product._id = product._id;
        console.log(localstorage.getItem("cartId"));
        this.http
            .get(Values.BASE_URL + "carts/" + localstorage.getItem("cartId"))
            .subscribe((res: any) => {
                if (res != null && res != undefined) {
                    if (res.isSuccess == true) {
                        if (res.data.products.length != 0) {
                            for (var i = 0; i < res.data.products.length; i++) {
                                if (product._id == res.data.products[i]._id) {
                                    var quantity = parseInt(res.data.products[i].quantity) + 1;
                                    this.cart.product.quantity = quantity.toString();
                                    this.updateCart();
                                    break;
                                }
                                else {
                                    this.cart.product.quantity = "1";
                                    this.updateCart();
                                }
                            }
                        }
                        else {
                            this.cart.product.quantity = "1";
                            this.updateCart();
                        }
                    }
                }
            }, error => {
                this.userService.showLoadingState(false);
                console.log(error.error.error);
            });
    }

    updateCart() {
        this.userService.showLoadingState(true);
        this.http
            .put(Values.BASE_URL + "carts/update/" + localstorage.getItem("cartId"), this.cart)
            .subscribe((res: any) => {
                if (res != null && res != undefined) {
                    if (res.isSuccess == true) {
                        Toast.makeText("Product is added to cart!!!", "long").show();
                        this.updateCartCount();
                    }
                }
            }, error => {
                this.userService.showLoadingState(false);
                console.log(error.error.error);
            });
    }

}
