import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import { Product } from "../models/product";


@Component({
    selector: "ns-cart",
    moduleId: module.id,
    templateUrl: "./view-orders.component.html",
    styleUrls: ["./view-orders.component.css"]
})

export class ViewOrdersComponent implements OnInit {

    orderedProducts = [];

    constructor(private route: ActivatedRoute, private router: Router) {
        // this.route.queryParams.subscribe(params => {
        //     this.image = params["image"];
        //     this.fullName = params["fullName"];
        //     this.quantity = params["quantity"];
        //     this.price = params["price"];
        // });
    }

    ngOnInit(): void {
        this.orderedProducts.push({ id: 0, username: "Sumit Sangwal gjjhg gjhgjh hjgjhgjh", phone: "1234567890", address: "jhsgdj asdjgajd asdgad agduas", image: "res://item_1", fullName: "Bee Fruity Red Gum Honey", quantity: "1", weight: "100 gm", price: "RS 100" });
        this.orderedProducts.push({ id: 1, username: "dsad asdasdas", phone: "4567654323", address: "jhsgdj asdjgajd asdgad agduas", image: "res://item_2", fullName: "Bee Fruity Red Gum Honey", quantity: "2", weight: "200 gm", price: "RS 150" });
        this.orderedProducts.push({ id: 2, username: "adadd asdadda", phone: "8765432134", address: "jhsgdj asdjgajd asdgad agduas", image: "res://item_3", fullName: "Bee Fruity Red Gum Honey", quantity: "3", weight: "400 gm", price: "RS 350" });
        this.orderedProducts.push({ id: 3, username: "asdasd asdasd", phone: "2345687655", address: "jhsgdj asdjgajd asdgad agduas", image: "res://item_4", fullName: "Bee Fruity Red Gum Honey", quantity: "4", weight: "500 gm", price: "RS 450" });
        this.orderedProducts.push({ id: 4, username: "asdas asdadda", phone: "3458765876", address: "jhsgdj asdjgajd asdgad agduas", image: "res://item_5", fullName: "Bee Fruity Red Gum Honey", quantity: "3", weight: "1 kg", price: "RS 850" });
        this.orderedProducts.push({ id: 5, username: "asdas asdasad", phone: "0987652345", address: "jhsgdj asdjgajd asdgad agduas", image: "res://item_1", fullName: "Bee Fruity Red Gum Honey", quantity: "7", weight: "100 gm", price: "RS 100" });
        this.orderedProducts.push({ id: 6, username: "asdas asdasdd", phone: "7654345676", address: "jhsgdj asdjgajd asdgad agduas", image: "res://item_2", fullName: "Bee Fruity Red Gum Honey", quantity: "1", weight: "200 gm", price: "RS 150" });
        this.orderedProducts.push({ id: 7, username: "asdasd asdasd", phone: "7564235443", address: "jhsgdj asdjgajd asdgad agduas", image: "res://item_3", fullName: "Bee Fruity Red Gum Honey", quantity: "2", weight: "400 gm", price: "RS 350" });
        this.orderedProducts.push({ id: 8, username: "sada adsasdsd", phone: "6456456435", address: "jhsgdj asdjgajd asdgad agduas", image: "res://item_4", fullName: "Bee Fruity Red Gum Honey", quantity: "1", weight: "500 gm", price: "RS 450" });
    }

    onBack() {
        this.router.navigate(['/profile']);
    }

    onViewDetail(product: Product) {
        // console.log(product.fullName);
        // let navigationExtras: NavigationExtras = {
        //     queryParams: {
        //         "image": product.image,
        //         "fullName": product.fullName,
        //         "weight": product.weight,
        //         "price": product.price,
        //     },
        // };
        this.router.navigate(['/orderDetail']);
    }
}
