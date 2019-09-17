import { Component, OnInit } from "@angular/core";
import { NavigationExtras, ActivatedRoute } from "@angular/router";
import { Values } from "~/app/values/values";
import { HttpClient } from "@angular/common/http";
import { Cart } from "~/app/models/cart.model";
import { UserService } from "~/app/services/user.service";
import { Product } from "~/app/models/product.model";
import { RouterExtensions } from "nativescript-angular/router";
import { NavigationService } from "~/app/services/navigation.service";
import { BackgroundHttpService } from "~/app/services/background.http.service";
import { Page } from "tns-core-modules/ui/page/page";

import * as localstorage from "nativescript-localstorage";
import * as Toast from 'nativescript-toast';


@Component({
    selector: "ns-similarProductUser",
    moduleId: module.id,
    templateUrl: "./similar-productUser.component.html",
    styleUrls: ["./similar-productUser.component.css"]
})

export class SimilarProductUserComponent implements OnInit {

    similarProducts = [];
    cartCount: number;
    categoryId: string;
    product: Product;
    isCartCount: boolean;
    cart: Cart;
    heading: string;
    similarPageNo = 1;
    similarInit = true;
    isRendering: boolean;
    isLoading: boolean;

    constructor(private routerExtensions: RouterExtensions, private navigationService: NavigationService, private route: ActivatedRoute, private userService: UserService, private http: HttpClient, private backgroundHttpService: BackgroundHttpService, private page: Page) {
        this.page.actionBarHidden = true;
        this.isLoading = false;
        this.isRendering = false;

        this.product = new Product();
        this.cart = new Cart();
        this.cart.product = new Product();
        this.heading = "";
        this.route.queryParams.subscribe(params => {
            if (params["categoryId"] != null && params["categoryId"] != undefined) {
                this.categoryId = params["categoryId"];
            }
        });
        this.navigationService.backTo = "homeUser";

        this.http
            .get(Values.BASE_URL + "categories/" + this.categoryId)
            .subscribe((res: any) => {
                if (res != null && res != undefined) {
                    if (res.isSuccess == true) {
                        this.heading = res.data.name;
                    }
                }
            }, error => {
                this.userService.showLoadingState(false);
                alert(error.error.error);
            });

        if (localstorage.getItem("userToken") != null && localstorage.getItem("userToken") != undefined && localstorage.getItem("userId") != null && localstorage.getItem("userId") != undefined) {
            this.getSimilarProducts();
        }
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.isRendering = true;
        }, 50);
    }

    onLoadMoreSimilarItems() {
        if (!this.similarInit) {
            this.similarPageNo = this.similarPageNo + 1;
            this.getSimilarProducts();
        }
        this.similarInit = false;
    }

    getSimilarProducts() {
        this.userService.showLoadingState(true);
        this.http
            .get(Values.BASE_URL + `similarProducts?_id=${this.categoryId}&status=enabled&pageNo=${this.similarPageNo}&items=10`)
            .subscribe((res: any) => {
                if (res != null && res != undefined) {
                    if (res.isSuccess == true) {
                        this.userService.showLoadingState(false);
                        for (var i = 0; i < res.data.products.length; i++) {
                            this.similarProducts.push({
                                _id: res.data.products[i]._id,
                                status: res.data.products[i].status,
                                image: res.data.products[i].image.resize_url,
                                brandName: res.data.products[i].brand,
                                name: res.data.products[i].name,
                                heading: res.data.products[i].heading.title,
                                weight: res.data.products[i].dimensions[0].value + " " + res.data.products[i].dimensions[0].unit,
                                price: "Rs " + res.data.products[i].price.value,
                            })
                        }
                        // this.updateCartCount();
                        this.similarInit = true;
                    }
                }
            }, error => {
                this.userService.showLoadingState(false);
                alert(error.error.error);
            });
    }


    updateCartCount() {
        var storedCart = JSON.parse(localstorage.getItem('cart'));

        if (storedCart.products.length != 0) {
            this.isCartCount = true;
            this.cartCount = storedCart.products.length;
        }
    }


    onViewDetail(product: Product) {
        // let navigationExtras: NavigationExtras = {
        //     queryParams: {
        //         "productId": product._id,
        //         "classType": "similarProduct"
        //     },
        // };
        this.routerExtensions.navigate(['/productDetail'], {
            queryParams: {
                "productId": product._id,
                "classType": "similarProduct"
            },
        });
    }

    onBack() {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                "index": "1"
            },
        };
        // this.routerExtensions.navigate(['./homeUser'], {
        //     queryParams: {
        //         "index": "1"
        //     },
        //     clearHistory: true,
        // });
        this.routerExtensions.back();
    }

    onAddCart(product: Product) {
        this.cart.product._id = product._id;
        this.cart.product.isSimilarProduct = true;

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
    }


    updateCart(cardId: string) {

        this.backgroundHttpService
            .put(Values.BASE_URL + `carts/update/${cardId}`, {}, this.cart)
            .then((res: any) => {
                if (res != null && res != undefined) {
                    if (res.isSuccess == true) {
                        console.log(res);
                        // this.userService.showLoadingState(false);
                        Toast.makeText("Product is added to cart!!!", "long").show();
                        this.updateCartCount();
                    }
                }
            }, error => {
                // this.userService.showLoadingState(false);
                console.log(error.error.error);
            });
    }

    onCartClick() {
        this.routerExtensions.navigate(['/cart']);
    }
}
