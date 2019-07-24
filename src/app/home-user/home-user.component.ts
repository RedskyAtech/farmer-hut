import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
// import { RouterExtensions } from "nativescript-angular/router";
import { Router, NavigationExtras } from "@angular/router";
import { SelectedIndexChangedEventData } from "tns-core-modules/ui/tab-view";
import { Product } from "~/app/models/product.model";
import * as localstorage from "nativescript-localstorage";
import { HttpClient } from "@angular/common/http";
import { Values } from "~/app/values/values";
import { UserService } from '../services/user.service';
import { Dimensions } from "../models/dimensions.model";
import { Price } from "../models/price.model";

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
    cartCount: boolean;
    product: Product;

    constructor(private router: Router, private http: HttpClient, private userService: UserService) {
        this.sliderImage1 = "res://slider1";
        this.sliderImage2 = "res://slider2";
        this.sliderImage3 = "res://slider3";
        this.sliderImage4 = "res://slider4";

        this.product = new Product();

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
            this.userService.showLoadingState(true);
            this.http
                .get(Values.BASE_URL + "products?status=enabled")
                .subscribe((res: any) => {
                    if (res != null && res != undefined) {
                        if (res.isSuccess == true) {
                            this.userService.showLoadingState(false);
                            for (var i = 0; i < res.data.length; i++) {
                                this.products.push({
                                    id: res.data[i]._id,
                                    status: res.data[i].status,
                                    image: res.data[i].image.url,
                                    brandName: res.data[i].brand,
                                    name: res.data[i].name,
                                    weight: res.data[i].dimensions[0].value + " " + res.data[i].dimensions[0].unit,
                                    price: res.data[i].price.currency + " " + res.data[i].price.value,
                                })
                            }
                        }
                    }
                }, error => {
                    this.userService.showLoadingState(false);
                    alert(error.error.error);
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

    onViewDetail(product: Product) {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                "productId": product.id,
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

    onAddCart(i: number) {
        this.cartCount = true;
    }

}
