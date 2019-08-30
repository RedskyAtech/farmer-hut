import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import * as localstorage from "nativescript-localstorage";
import { Values } from "~/app/values/values";
import { HttpClient } from "@angular/common/http";
import * as Toast from 'nativescript-toast';
import { Cart } from "~/app/models/cart.model";
import { UserService } from "~/app/services/user.service";
import { Product } from "~/app/models/product.model";
import { RouterExtensions } from "nativescript-angular/router";
import { NavigationService } from "~/app/services/navigation.service";

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

    constructor(private routerExtensions: RouterExtensions, private navigationService: NavigationService, private route: ActivatedRoute, private userService: UserService, private http: HttpClient) {
        this.product = new Product();
        this.cart = new Cart();
        this.cart.product = new Product();
        this.route.queryParams.subscribe(params => {
            if (params["categoryId"] != null && params["categoryId"] != undefined) {
                this.categoryId = params["categoryId"];
            }
        });
        this.navigationService.backTo = "homeUser";

        if (localstorage.getItem("userToken") != null && localstorage.getItem("userToken") != undefined && localstorage.getItem("userId") != null && localstorage.getItem("userId") != undefined) {
            this.getSimilarProducts();
        }
    }

    ngOnInit(): void {
    }

    getSimilarProducts() {
        this.userService.showLoadingState(true);
        this.http
            .get(Values.BASE_URL + "similarProducts?_id=" + this.categoryId + "&status=enabled")
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
                                heading: res.data[i].heading.title,
                                weight: res.data[i].dimensions[0].value + " " + res.data[i].dimensions[0].unit,
                                price: "Rs " + res.data[i].price.value,
                            })
                        }
                        this.updateCartCount();
                    }
                }
            }, error => {
                this.userService.showLoadingState(false);
                alert(error.error.error);
            });
    }

    updateCartCount() {
        this.userService.showLoadingState(true);
        this.http
            .get(Values.BASE_URL + "carts/" + localstorage.getItem("cartId"))
            .subscribe((res: any) => {
                if (res != null && res != undefined) {
                    if (res.isSuccess == true) {
                        this.userService.showLoadingState(false);
                        if (res.data.products.length != 0) {
                            this.isCartCount = true;
                            this.cartCount = res.data.products.length;
                        }
                    }
                }
            }, error => {
                this.userService.showLoadingState(false);
                console.log(error.error.error);
            });
    }

    onViewDetail(product: Product) {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                "productId": product._id,
                "classType": "similarProduct"
            },
        };
        this.routerExtensions.navigate(['/productDetail'], {
            queryParams: {
                "productId": product._id,
                "classType": "similarProduct"
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
        this.routerExtensions.navigate(['./homeUser'], {
            queryParams: {
                "index": "1"
            },
            clearHistory: true,
        });
    }

    onAddCart(product: Product) {
        this.userService.showLoadingState(true);
        this.cart.product._id = product._id;
        this.cart.product.isSimilarProduct = true;
        this.http
            .get(Values.BASE_URL + "carts/" + localstorage.getItem("cartId"))
            .subscribe((res: any) => {
                if (res != null && res != undefined) {
                    if (res.isSuccess == true) {
                        this.userService.showLoadingState(false);
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
        console.log(this.cart);
        this.http
            .put(Values.BASE_URL + "carts/update/" + localstorage.getItem("cartId"), this.cart)
            .subscribe((res: any) => {
                if (res != null && res != undefined) {
                    if (res.isSuccess == true) {
                        console.log(res);
                        this.userService.showLoadingState(false);
                        Toast.makeText("Product is added to cart!!!", "long").show();
                        this.updateCartCount();
                    }
                }
            }, error => {
                this.userService.showLoadingState(false);
                console.log(error.error.error);
            });
    }

    onCartClick() {
        this.routerExtensions.navigate(['/cart'], {
            clearHistory: true,
        });
    }
}
