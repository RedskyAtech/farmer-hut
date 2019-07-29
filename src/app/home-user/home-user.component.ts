import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
// import { RouterExtensions } from "nativescript-angular/router";
import { Router, NavigationExtras } from "@angular/router";
import { SelectedIndexChangedEventData } from "tns-core-modules/ui/tab-view";
import { Product } from "~/app/models/product.model";
import { Cart } from "~/app/models/cart.model";
import * as localstorage from "nativescript-localstorage";
import { HttpClient } from "@angular/common/http";
import { Values } from "~/app/values/values";
import { UserService } from '../services/user.service';
import * as Toast from 'nativescript-toast';

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

    constructor(private router: Router, private http: HttpClient, private userService: UserService) {
        this.sliderImage1 = "";
        this.sliderImage2 = "";
        this.sliderImage3 = "";
        this.sliderImage4 = "";

        this.product = new Product();
        this.cart = new Cart();
        this.cart.product = new Product();

        this.products = [];

        setInterval(() => {
            setTimeout(() => {
                this.selectedPage++;
            }, 2000)
            if (this.selectedPage == 3) {
                setTimeout(() => {
                    this.selectedPage = 0;
                }, 2000);
            }
        }, 2000);

        if (localstorage.getItem("userToken") != null && localstorage.getItem("userToken") != undefined && localstorage.getItem("userId") != null && localstorage.getItem("userId") != undefined) {
            this.updateSlider();
            this.userService.showLoadingState(true);
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
                                    price: res.data[i].price.currency + " " + res.data[i].price.value,
                                })
                            }
                            if (localstorage.getItem("cartId") != null && localstorage.getItem("cartId")) {
                                this.updateCartCount();
                            }
                        }
                    }
                }, error => {
                    this.userService.showLoadingState(false);
                    console.log(error.error.error);
                });
        }

    }

    ngOnInit(): void {

        this.productCategories.push({ categoryName: "Category 1", image: "res://item_8" });
        this.productCategories.push({ categoryName: "Category 2", image: "res://item_9", });
        this.productCategories.push({ categoryName: "Category 3", image: "res://item_10" });
        this.productCategories.push({ categoryName: "Category 4", image: "res://item_11" });
        this.productCategories.push({ categoryName: "Category 5", image: "res://item_12" });
        this.productCategories.push({ categoryName: "Category 6", image: "res://item_13" });
        this.productCategories.push({ categoryName: "Category 7", image: "res://item_8", });
        this.productCategories.push({ categoryName: "Category 8", image: "res://item_9", });
        this.productCategories.push({ categoryName: "Category 9", image: "res://item_10" });
    }

    onSelectedIndexChanged(args: SelectedIndexChangedEventData) {
        if (args.oldIndex !== -1) {
            // const newIndex = args.newIndex;
            // if (newIndex === 0) {
            //     this.tabSelectedIndexResult = "Profile Tab (tabSelectedIndex = 0 )";
            //     this.tabSelectedIndex = 0;
            // } else if (newIndex === 1) {
            //     this.tabSelectedIndexResult = "Stats Tab (tabSelectedIndex = 1 )";
            // } else if (newIndex === 2) {
            //     this.tabSelectedIndexResult = "Settings Tab (tabSelectedIndex = 2 )";
            // }
        }
    }

    updateSlider() {
        this.userService.showLoadingState(true);
        this.http
            .get(Values.BASE_URL + "files")
            .subscribe((res: any) => {
                if (res != null && res != undefined) {
                    if (res.isSuccess == true) {
                        this.userService.showLoadingState(false);
                        this.sliderImage1 = res.data[0].images[0].url;
                        this.sliderImage2 = res.data[0].images[1].url;
                        this.sliderImage3 = res.data[0].images[2].url;
                        this.sliderImage4 = res.data[0].images[3].url;
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

    onViewDetail(product: Product) {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                "productId": product._id,
            },
        };
        this.router.navigate(['/productDetail'], navigationExtras);
    }

    onCategory(product: Product) {
        this.router.navigate(['/similarProductUser']);
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
        this.http
            .put(Values.BASE_URL + "carts/update/" + localstorage.getItem("cartId"), this.cart)
            .subscribe((res: any) => {
                if (res != null && res != undefined) {
                    if (res.isSuccess == true) {
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

}
