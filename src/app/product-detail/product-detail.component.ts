import { Component, OnInit, AfterViewInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { SelectedIndexChangedEventData } from "tns-core-modules/ui/tab-view";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import * as localstorage from "nativescript-localstorage";
import { HttpClient } from "@angular/common/http";
import { Values } from "~/app/values/values";
import { UserService } from '../services/user.service';
import { Cart } from '~/app/models/cart.model';
import * as Toast from 'nativescript-toast';
import { Product } from "../models/product.model";

@Component({
    selector: "ns-productDetail",
    moduleId: module.id,
    templateUrl: "./product-detail.component.html",
    styleUrls: ["./product-detail.component.css"]
})
export class ProductDetailComponent implements OnInit, AfterViewInit {
    productId: string;
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

    constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private userService: UserService) {

        this.route.queryParams.subscribe(params => {
            this.productId = params["productId"];
            this.classType = params["classType"];
        });

        this.userService.showLoadingState(true);
        this.cart = new Cart();
        this.cart.product = new Product();
        this.isRenderingDetail = false;

        if (this.classType == "similarProduct") {
            this.http
                .get(Values.BASE_URL + "similarProducts/" + this.productId)
                .subscribe((res: any) => {
                    if (res != null && res != undefined) {
                        if (res.isSuccess == true) {
                            this.userService.showLoadingState(false);
                            this.image = res.data.image.url;
                            this.brandName = res.data.brand;
                            this.fullName = res.data.name;
                            this.detailHeading = res.data.heading.title;
                            this.detailDescription = res.data.heading.description;
                            this.quantity = res.data.dimensions[0].value + " " + res.data.dimensions[0].unit;
                            this.price = "Rs " + res.data.price.value;
                            this.userService.showLoadingState(false);
                            this.isRenderingDetail = true;
                            this.updateCartCount();
                        }
                    }
                }, error => {
                    this.userService.showLoadingState(false);
                    alert(error.error.error);
                });
        }
        else {
            this.http
                .get(Values.BASE_URL + "products/" + this.productId)
                .subscribe((res: any) => {
                    if (res != null && res != undefined) {
                        if (res.isSuccess == true) {
                            this.userService.showLoadingState(false);
                            this.image = res.data.image.url;
                            this.brandName = res.data.brand;
                            this.fullName = res.data.name;
                            this.detailHeading = res.data.heading.title;
                            this.detailDescription = res.data.heading.description;
                            this.quantity = res.data.dimensions[0].value + " " + res.data.dimensions[0].unit;
                            this.price = "Rs " + res.data.price.value;
                            this.userService.showLoadingState(false);
                            this.isRenderingDetail = true;
                            this.updateCartCount();
                        }
                    }
                }, error => {
                    this.userService.showLoadingState(false);
                    alert(error.error.error);
                });
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

    }

    ngAfterViewInit(): void {

    }


    onBack() {
        this.router.navigate(['/homeUser']);
    }

    onCartClick() {
        this.router.navigate(['/cart']);
    }

    onAddToCart() {
        // this.addToCartButton = false;
        // this.addedCartButton = true;
        this.userService.showLoadingState(true);
        this.cart.product._id = this.productId;

        this.http
            .get(Values.BASE_URL + "carts/" + localstorage.getItem("cartId"))
            .subscribe((res: any) => {
                if (res != null && res != undefined) {
                    if (res.isSuccess == true) {
                        this.userService.showLoadingState(false);
                        if (res.data.products.length != 0) {
                            for (var i = 0; i < res.data.products.length; i++) {
                                if (this.productId == res.data.products[i]._id) {
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
                        this.userService.showLoadingState(false);
                        this.updateCartCount();
                    }
                }
            }, error => {
                this.userService.showLoadingState(false);
                console.log(error.error.error);
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

    onBuyNow() {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                "image": this.image,
                "fullName": this.fullName,
                "quantity": this.quantity,
                "price": this.price
            },
        };
        this.router.navigate(['/cart'], navigationExtras);
    }

}
