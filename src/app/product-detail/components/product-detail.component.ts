import { Component, OnInit, AfterViewInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { Values } from "~/app/values/values";
import { UserService } from '../../services/user.service';
import { Cart } from '~/app/models/cart.model';
import { Product } from "../../models/product.model";
import { NavigationService } from "~/app/services/navigation.service";

import * as localstorage from "nativescript-localstorage";
import * as Toast from 'nativescript-toast';
import { Page } from "tns-core-modules/ui/page/page";
import { BackgroundHttpService } from "~/app/services/background.http.service";


@Component({
    selector: "ns-productDetail",
    moduleId: module.id,
    templateUrl: "./product-detail.component.html",
    styleUrls: ["./product-detail.component.css"]
})
export class ProductDetailComponent implements OnInit, AfterViewInit {
    id: string;
    image: string;
    brandName: string;
    fullName: string;
    detailHeading: string;
    detailDescription: string;
    quantity: string;
    price: string;
    cartStatus: boolean;
    addToCartButton: boolean;
    addedCartButton: boolean;
    cartCount: number;
    isCartCount: boolean;
    cart: Cart;
    classType: string;
    isRenderingDetail: boolean;
    isRendering: boolean;
    hasBeenHitOnce: boolean;

    genricProduct: any;
    // isLoading: boolean;

    constructor(private route: ActivatedRoute, private navigationService: NavigationService, private routerExtensions: RouterExtensions, private http: HttpClient, private userService: UserService, private page: Page, private backgroundHttpService: BackgroundHttpService) {
        this.isRendering = false;
        // this.isLoading = false;
        this.page.actionBarHidden = true;
        this.hasBeenHitOnce = false;

        this.route.queryParams.subscribe(params => {
            if (params["product"] != undefined) {
                this.genricProduct = JSON.parse(params["product"]);
                console.log('Got:::', params["product"])
            }
            if (params["classType"] != undefined) {
                this.classType = params["classType"];
            }
        });

        this.userService.showLoadingState(true);
        this.cart = new Cart();
        this.cart.product = new Product();
        this.isRenderingDetail = false;
        this.navigationService.backTo = "homeUser";

        if (this.classType == "similarProduct") {

            this.id = this.genricProduct._id;
            this.image = this.genricProduct.image;
            this.brandName = this.genricProduct.brandName;
            this.fullName = this.genricProduct.name;
            this.detailHeading = this.genricProduct.heading;
            this.detailDescription = this.genricProduct.description;
            this.quantity = this.genricProduct.weight;
            this.price = this.genricProduct.price

            this.cart.product.isSimilarProduct = true;

            this.isRenderingDetail = true;
        }
        else {
            this.id = this.genricProduct._id;
            this.image = this.genricProduct.image;
            this.brandName = this.genricProduct.brandName;
            this.fullName = this.genricProduct.name;
            this.detailHeading = this.genricProduct.heading;
            this.detailDescription = this.genricProduct.description;
            this.quantity = this.genricProduct.weight;
            this.price = this.genricProduct.price;

            this.cart.product.isSimilarProduct = false;

            this.isRenderingDetail = true;
        }

        if (this.cartStatus == true) {
            this.addToCartButton = false;
            this.addedCartButton = true;
        }
        else {
            this.addToCartButton = true;
            this.addedCartButton = false;
        }
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.isRendering = true;
        }, 50);
    }

    ngAfterViewInit(): void {

    }


    onBack() {
        // this.routerExtensions.navigate(['/homeUser'], {
        //     clearHistory: true,
        // });

        this.routerExtensions.back();
    }

    onCartClick() {
        this.routerExtensions.navigate(['/cart'], {
        });
    }


    productExistance = async (product: Product): Promise<boolean> => {

        var storedCartProducts = JSON.parse(localstorage.getItem('cart'));

        return new Promise<boolean>((resolve, reject) => {
            for (var i = 0; i < storedCartProducts.length; i++) {
                if (product._id == storedCartProducts[i]._id) {
                    var quantity = parseInt(storedCartProducts[i].quantity) + 1;
                    this.cart.product.quantity = quantity.toString();
                    // this.updateCart(storedCart._id);
                    alert("Product already in cart, Please increase quantity in cart");
                    resolve(true);
                    return;
                }
            }
            reject(false);
        })
    }

    onAddToCart() {

        this.userService.showLoadingState(true);
        this.cart.product._id = this.id;
        console.log(this.id);

        var storedCartProducts = JSON.parse(localstorage.getItem('cart'));

        if (storedCartProducts.length != 0) {
            this.productExistance(this.genricProduct).then((res) => {

            }, error => {
                this.cart.product.quantity = "1";
                storedCartProducts.push(new Product(this.genricProduct));
                localstorage.setItem(JSON.stringify(storedCartProducts));
                this.updateCart();
            })

        }
        else {
            this.cart.product.quantity = "1";
            storedCartProducts.push(new Product(this.genricProduct));
            localstorage.setItem(JSON.stringify(storedCartProducts));
            this.updateCart();
        }

        this.updateCartCount();
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
                            localstorage.setItem('cart', JSON.stringify(tempCart));
                            Toast.makeText("Product is added to cart!!!", "long").show();
                            this.updateCartCount();
                            this.cart = new Cart();
                            this.cart.product = new Product();
                        }
                    }
                    this.hasBeenHitOnce = false;
                }, error => {
                    this.hasBeenHitOnce = false;
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


    updateCartCount() {
        var storedCart = JSON.parse(localstorage.getItem('cart'));

        if (storedCart.length != 0) {
            this.isCartCount = true;
            this.cartCount = storedCart.length;
        } else {
            this.isCartCount = false;
        }
    }

    onBuyNow() {

        this.userService.showLoadingState(true);
        this.cart.product._id = this.id;

        var storedCartProducts = JSON.parse(localstorage.getItem('cart'));

        if (storedCartProducts.length != 0) {
            for (var i = 0; i < storedCartProducts.length; i++) {
                if (this.id == storedCartProducts[i]._id) {
                    this.routerExtensions.navigate(['/cart']);
                    return;
                }
            }
            this.cart.product.quantity = "1";
            storedCartProducts.push(new Product(this.genricProduct));
            localstorage.setItem(JSON.stringify(storedCartProducts));
            this.routerExtensions.navigate(['/cart']);
            this.updateCart();
        }
        else {
            this.cart.product.quantity = "1";
            storedCartProducts.push(new Product(this.genricProduct));
            localstorage.setItem(JSON.stringify(storedCartProducts));
            this.routerExtensions.navigate(['/cart']);
            this.updateCart();
        }
















        // // this.isLoading = true;
        // this.http
        //     .get(Values.BASE_URL + "carts/" + localstorage.getItem("cartId"))
        //     .subscribe((res: any) => {
        //         if (res != null && res != undefined) {
        //             if (res.isSuccess == true) {
        //                 // this.isLoading = false;
        //                 this.userService.showLoadingState(false);
        //                 if (res.data.products.length != 0) {
        //                     for (var i = 0; i < res.data.products.length; i++) {
        //                         if (this.id == res.data.products[i]._id) {
        //                             var quantity = parseInt(res.data.products[i].quantity) + 1;
        //                             this.cart.product.quantity = quantity.toString();
        //                             this.routerExtensions.navigate(['/cart'])
        //                             this.updateCart();
        //                             break;
        //                         }
        //                         else {
        //                             this.cart.product.quantity = "1";
        //                             this.routerExtensions.navigate(['/cart'])
        //                             this.updateCart();
        //                         }
        //                     }
        //                 }
        //                 else {
        //                     this.cart.product.quantity = "1";
        //                     this.routerExtensions.navigate(['/cart'])
        //                     this.updateCart();
        //                 }
        //             }
        //         }
        //     }, error => {
        //         // this.isLoading = false;
        //         this.userService.showLoadingState(false);
        //         console.log(error.error.error);
        //     });
    }

}
