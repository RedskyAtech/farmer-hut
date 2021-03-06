import { CartService } from './../../services/cart.service';
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
    cartCount: number | string;
    categoryId: string;
    product: Product;
    isCartCount: boolean;
    cart: Cart;
    heading: string;
    similarPageNo = 1;
    similarInit = true;
    isRendering: boolean;
    isLoading: boolean;
    hasBeenHitOnce: boolean;
    isRenderingMessage: boolean;

    isLoadingSimilarProducts: boolean;
    shouldLoadSimilarProducts: boolean;

    constructor(private routerExtensions: RouterExtensions, private navigationService: NavigationService, private route: ActivatedRoute, private userService: UserService, private http: HttpClient, private backgroundHttpService: BackgroundHttpService, private page: Page, private cartService: CartService) {
        this.page.actionBarHidden = true;
        this.isLoading = false;
        this.isRendering = false;
        this.hasBeenHitOnce = false;

        this.shouldLoadSimilarProducts = false;
        this.isLoadingSimilarProducts = false;
        this.userService.activeScreen('');

        this.product = new Product();
        this.cart = new Cart();
        this.cart.product = new Product();
        this.heading = "";
        this.isRenderingMessage = false;
        this.route.queryParams.subscribe(params => {
            if (params["categoryId"] != null && params["categoryId"] != undefined) {
                this.categoryId = params["categoryId"];
            }
        });
        this.navigationService.backTo = "homeUser";

        this.page.on('navigatedTo', (data) => {
            console.log("ddata:::", data.isBackNavigation);
            console.log("navigating to this page");

            if (data.isBackNavigation) {
                this.updateCartCount();
            }
        })

        this.http
            .get(Values.BASE_URL + "categories/" + this.categoryId)
            .subscribe((res: any) => {
                if (res != null && res != undefined) {
                    if (res.isSuccess == true) {
                        this.heading = decodeURIComponent(res.data.name);
                    }
                }
            }, error => {
                this.userService.showLoadingState(false);
                if (error.error.error == undefined) {
                    alert("Something went wrong!!! May be your network connection is low.");
                }
            });

        if (localstorage.getItem("userToken") != null && localstorage.getItem("userToken") != undefined && localstorage.getItem("userId") != null && localstorage.getItem("userId") != undefined) {
            this.getSimilarProducts();
        }
        this.cartService.cartCountObservable.subscribe((count: string) => {
            if (count == "0") {
                this.isCartCount = false;
            }
            else {
                this.cartCount = count;
                this.isCartCount = true;
            }
        });
        this.updateCartCount();
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.isRendering = true;
        }, 50);
    }

    onSimilarItemLoading(args: any) {
        console.log('ProductItemLoaded:::', args.index)
        var criteria = (this.similarPageNo * 10) - 5;
        if (this.shouldLoadSimilarProducts) {
            if (args.index == criteria) {
                this.similarPageNo = this.similarPageNo + 1;
                this.getSimilarProducts();
            }
        }
        this.shouldLoadSimilarProducts = true;
    }

    getSimilarProducts() {
        this.isLoadingSimilarProducts = true;

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
                                price: res.data.products[i].price.value,
                                description: res.data.products[i].heading.description,
                                isSimilarProduct: res.data.products[i].isSimilarProduct
                            })
                        }

                        this.similarInit = true;
                        setTimeout(() => {
                            this.isLoadingSimilarProducts = false;
                        }, 5)
                        this.shouldLoadSimilarProducts = false;
                    }
                }
            }, error => {
                setTimeout(() => {
                    this.isLoadingSimilarProducts = false;
                }, 5)
                this.userService.showLoadingState(false);
                if (error.error.error == undefined) {
                    alert("Something went wrong!!! May be your network connection is low.");
                }
                else {
                    alert(error.error.error);
                }
            });
    }


    updateCartCount() {
        var storedCart = JSON.parse(localstorage.getItem('cart'));

        if (storedCart.length != 0) {
            // this.cartService.setCartCount(storedCart.length.toString())
            this.cartService.getCartCount();
            this.cartService.cartCountObservable.subscribe((count: string) => {
                if (count != undefined) {
                    this.cartCount = count;
                }
            });
            this.isCartCount = true;
            this.cartCount = storedCart.length;
        } else {
            this.isCartCount = false;
        }
    }


    onListItemTap(args: any) {
        this.routerExtensions.navigate(['/productDetail'], {
            queryParams: {
                "product": JSON.stringify(this.similarProducts[args.index]),
                "classType": "similarProduct"
            },
        });
    }

    onViewDetail(product: Product) {
        this.routerExtensions.navigate(['/productDetail'], {
            queryParams: {
                "product": JSON.stringify(product),
                "classType": "similarProduct"
            },
        });
    }

    onBack() {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                "index": "5"
            },
        };
        this.routerExtensions.back(navigationExtras);
    }


    productExistance = async (product: Product): Promise<boolean> => {

        var storedCartProducts = JSON.parse(localstorage.getItem('cart'));

        return new Promise<boolean>((resolve, reject) => {
            for (var i = 0; i < storedCartProducts.length; i++) {
                if (product._id == storedCartProducts[i]._id) {
                    var quantity = parseInt(storedCartProducts[i].quantity) + 1;
                    this.cart.product.quantity = quantity.toString();
                    alert("Product already in cart, Please increase quantity in cart");
                    resolve(true);
                    return;
                }
            }
            reject(false);
        })
    }


    onAddCart(product: Product) {
        this.cart.product._id = product._id;
        this.cart.product.isSimilarProduct = true;

        var storedCartProducts = JSON.parse(localstorage.getItem('cart'));


        if (storedCartProducts.length != 0) {


            this.productExistance(product).then((res) => {

            }, error => {
                this.cart.product.quantity = "1";
                storedCartProducts.push(new Product(product));
                // this.cartService.setCartCount(storedCartProducts.length.toString())
                this.cartService.getCartCount();
                this.cartService.cartCountObservable.subscribe((count: string) => {
                    if (count != undefined) {
                        this.cartCount = count;
                    }
                });
                localstorage.setItem(JSON.stringify(storedCartProducts));
                this.updateCart();
            })
        }
        else {
            this.cart.product.quantity = "1";
            storedCartProducts.push(new Product(product));
            // this.cartService.setCartCount(storedCartProducts.length.toString())
            this.cartService.getCartCount();
            this.cartService.cartCountObservable.subscribe((count: string) => {
                if (count != undefined) {
                    this.cartCount = count;
                }
            });
            localstorage.setItem(JSON.stringify(storedCartProducts));
            this.updateCart();
        }
    }


    updateCart() {

        var tempCart = [];

        if (!this.hasBeenHitOnce) {

            this.hasBeenHitOnce = true;

            this.backgroundHttpService
                .put(Values.BASE_URL + `carts/update/${localstorage.getItem('cartId')}`, {}, this.cart)
                .then((res: any) => {
                    if (res != null && res != undefined) {
                        if (res.isSuccess == true) {
                            if (res.data && res.data.products) {
                                for (var i = 0; i < res.data.products.length; i++) {
                                    tempCart.push(new Product(res.data.products[i]));
                                }
                            }
                            // this.cartService.setCartCount(res.data.products.length.toString())
                            this.cartService.getCartCount();
                            this.cartService.cartCountObservable.subscribe((count: string) => {
                                if (count != undefined) {
                                    this.cartCount = count;
                                }
                            });
                            localstorage.setItem('cart', JSON.stringify(tempCart));
                            Toast.makeText("Product is added to cart!!!", "long").show();
                            // this.updateCartCount();
                            this.cart = new Cart();
                            this.cart.product = new Product();
                        }
                    }
                    this.hasBeenHitOnce = false;
                }, error => {
                    this.hasBeenHitOnce = false;
                    if (error.error.error == undefined) {
                        alert("Something went wrong!!! May be your network connection is low.");
                    }
                    else {
                        alert(error.error.error);
                    }
                });
        }
    }

    onCartClick() {
        this.routerExtensions.navigate(['/cart']);
    }
}
