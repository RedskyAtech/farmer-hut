import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
// import { RouterExtensions } from "nativescript-angular/router";
import { Router, NavigationExtras } from "@angular/router";
import { SelectedIndexChangedEventData } from "tns-core-modules/ui/tab-view";
import { Product } from "~/app/models/product";
// import { ExtendedNavigationExtras } from "nativescript-angular/router/router-extensions";

@Component({
    selector: "ns-similarProducts",
    moduleId: module.id,
    templateUrl: "./similar-productAdmin.component.html",
    styleUrls: ["./similar-productAdmin.component.css"]
})

export class SimilarProductAdminComponent implements OnInit {

    similarProducts = [];

    constructor(private router: Router) {
    }

    ngOnInit(): void {
        this.similarProducts.push({ brandName: "Runny Honey", status: "active", image: "res://item_8", fullName: "Bee Fruity Red Gum Honey", name: "Bee Fruity", detailHeading: "Versatile - from smoothies to marinades.", detailDescription: "The rich golden coloured honey has a distinctive full bodied heady fresh fruit flavour and a richly golden colour. This honey is fantastically versatile and can be used in almost any recipe from smoothies to marinades.", quantity: "100 gm", price: "RS 100" });
        this.similarProducts.push({ brandName: "Runny Honey", status: "inactive", image: "res://item_9", fullName: "Bee Fruity Red Gum Honey", name: "Chunk Honeycomb", detailHeading: "Versatile - from smoothies to marinades.", detailDescription: "The rich golden coloured honey has a distinctive full bodied heady fresh fruit flavour and a richly golden colour. This honey is fantastically versatile and can be used in almost any recipe from smoothies to marinades.", quantity: "200 gm", price: "RS 150" });
        this.similarProducts.push({ brandName: "Runny Honey", status: "active", image: "res://item_10", fullName: "Bee Fruity Red Gum Honey", name: "Roogenic", detailHeading: "Versatile - from smoothies to marinades.", detailDescription: "The rich golden coloured honey has a distinctive full bodied heady fresh fruit flavour and a richly golden colour. This honey is fantastically versatile and can be used in almost any recipe from smoothies to marinades.", quantity: "400 gm", price: "RS 350" });
        this.similarProducts.push({ brandName: "Runny Honey", status: "inactive", image: "res://item_11", fullName: "Bee Fruity Red Gum Honey", name: "Bee Raw", detailHeading: "Versatile - from smoothies to marinades.", detailDescription: "The rich golden coloured honey has a distinctive full bodied heady fresh fruit flavour and a richly golden colour. This honey is fantastically versatile and can be used in almost any recipe from smoothies to marinades.", quantity: "500 gm", price: "RS 450" });
        this.similarProducts.push({ brandName: "Runny Honey", status: "active", image: "res://item_12", fullName: "Bee Fruity Red Gum Honey", name: "The Providore", detailHeading: "Versatile - from smoothies to marinades.", detailDescription: "The rich golden coloured honey has a distinctive full bodied heady fresh fruit flavour and a richly golden colour. This honey is fantastically versatile and can be used in almost any recipe from smoothies to marinades.", quantity: "1 kg", price: "RS 850" });
        this.similarProducts.push({ brandName: "Runny Honey", status: "active", image: "res://item_13", fullName: "Bee Fruity Red Gum Honey", name: "Gustare Raw Honey", detailHeading: "Versatile - from smoothies to marinades.", detailDescription: "The rich golden coloured honey has a distinctive full bodied heady fresh fruit flavour and a richly golden colour. This honey is fantastically versatile and can be used in almost any recipe from smoothies to marinades.", quantity: "100 gm", price: "RS 100" });
        this.similarProducts.push({ brandName: "Runny Honey", status: "inactive", image: "res://item_8", fullName: "Bee Fruity Red Gum Honey", name: "Bee Fruity", detailHeading: "Versatile - from smoothies to marinades.", detailDescription: "The rich golden coloured honey has a distinctive full bodied heady fresh fruit flavour and a richly golden colour. This honey is fantastically versatile and can be used in almost any recipe from smoothies to marinades.", quantity: "200 gm", price: "RS 150" });
        this.similarProducts.push({ brandName: "Runny Honey", status: "active", image: "res://item_9", fullName: "Bee Fruity Red Gum Honey", name: "Chunk Honeycomb", detailHeading: "Versatile - from smoothies to marinades.", detailDescription: "The rich golden coloured honey has a distinctive full bodied heady fresh fruit flavour and a richly golden colour. This honey is fantastically versatile and can be used in almost any recipe from smoothies to marinades.", quantity: "400 gm", price: "RS 350" });
        this.similarProducts.push({ brandName: "Runny Honey", status: "inactive", image: "res://item_10", fullName: "Bee Fruity Red Gum Honey", name: "Roogenic", detailHeading: "Versatile - from smoothies to marinades.", detailDescription: "The rich golden coloured honey has a distinctive full bodied heady fresh fruit flavour and a richly golden colour. This honey is fantastically versatile and can be used in almost any recipe from smoothies to marinades.", quantity: "500 gm", price: "RS 450" });
    }

    // onSelectedIndexChanged(args: SelectedIndexChangedEventData) {
    //     if (args.oldIndex !== -1) {
    //         const newIndex = args.newIndex;
    //         if (newIndex === 0) {
    //             // this.tabSelectedIndexResult = "Profile Tab (tabSelectedIndex = 0 )";
    //             this.tabSelectedIndex = 0;
    //             this.addButtonText = "Add Product";
    //         } else if (newIndex === 1) {
    //             // this.tabSelectedIndexResult = "Stats Tab (tabSelectedIndex = 1 )";
    //             this.tabSelectedIndex = 1;
    //             this.addButtonText = "Add Category";
    //         }
    //     }
    // }

    onEdit(product: Product) {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                "image": product.image,
                "brandName": product.brandName,
                "productName": product.fullName,
                "detailHeading": product.detailHeading,
                "detailDescription": product.detailDescription,
                "weight": product.quantity,
                "price": product.price,
                "cartStatus": product.cartStatus
            },
        };
        this.router.navigate(['./addProduct'], navigationExtras);
    }

    onBack() {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                "index": "1"
            },
        };
        this.router.navigate(['./homeAdmin'], navigationExtras);
    }

    onAddButton() {
        // if (this.tabSelectedIndex == 0) {
        this.router.navigate(['./addProduct']);
        // }
        // if (this.tabSelectedIndex == 1) {
        //     this.router.navigate(['./addProduct']);
        // }
    }

    onProductInactive(i: number) {
        alert("product inactive at index: " + i);
    }

    onProductActive(i: number) {
        alert("product active at index: " + i);
    }
}
