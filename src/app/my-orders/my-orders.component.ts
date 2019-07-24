import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";


@Component({
    selector: "ns-cart",
    moduleId: module.id,
    templateUrl: "./my-orders.component.html",
    styleUrls: ["./my-orders.component.css"]
})

export class MyOrdersComponent implements OnInit {

    orderedProducts = [];
    address: string = "Select address";

    constructor(private route: ActivatedRoute, private router: Router) {
        // this.route.queryParams.subscribe(params => {
        //     this.image = params["image"];
        //     this.fullName = params["fullName"];
        //     this.quantity = params["quantity"];
        //     this.price = params["price"];
        // });
    }

    ngOnInit(): void {
        this.orderedProducts.push({ id: 0, image: "res://item_1", status: "Progress", fullName: "Bee Fruity Red Gum Honey", quantity: "100 gm", price: "RS 100", noOfProduct: 1 });
        this.orderedProducts.push({ id: 1, image: "res://item_2", status: "Confirmed", fullName: "Bee Fruity Red Gum Honey", quantity: "200 gm", price: "RS 150", noOfProduct: 1 });
        this.orderedProducts.push({ id: 2, image: "res://item_3", status: "Progress", fullName: "Bee Fruity Red Gum Honey", quantity: "400 gm", price: "RS 350", noOfProduct: 1 });
        this.orderedProducts.push({ id: 3, image: "res://item_4", status: "Progress", fullName: "Bee Fruity Red Gum Honey", quantity: "500 gm", price: "RS 450", noOfProduct: 1 });
        this.orderedProducts.push({ id: 4, image: "res://item_5", status: "Delivered", fullName: "Bee Fruity Red Gum Honey", quantity: "1 kg", price: "RS 850", noOfProduct: 1 });
        this.orderedProducts.push({ id: 5, image: "res://item_1", status: "Progress", fullName: "Bee Fruity Red Gum Honey", quantity: "100 gm", price: "RS 100", noOfProduct: 1 });
        this.orderedProducts.push({ id: 6, image: "res://item_2", status: "Progress", fullName: "Bee Fruity Red Gum Honey", quantity: "200 gm", price: "RS 150", noOfProduct: 1 });
        this.orderedProducts.push({ id: 7, image: "res://item_3", status: "Progress", fullName: "Bee Fruity Red Gum Honey", quantity: "400 gm", price: "RS 350", noOfProduct: 1 });
        this.orderedProducts.push({ id: 8, image: "res://item_4", status: "Progress", fullName: "Bee Fruity Red Gum Honey", quantity: "500 gm", price: "RS 450", noOfProduct: 1 });
    }

    onBack() {
        this.router.navigate(['/profile']);
    }
}
