import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
// import { RouterExtensions } from "nativescript-angular/router";
import { Router, NavigationExtras } from "@angular/router";
import { SelectedIndexChangedEventData } from "tns-core-modules/ui/tab-view";
import { Product } from "~/app/models/product.model";
import * as localstorage from "nativescript-localstorage";
import { UserService } from "../../services/user.service";
import { Values } from "~/app/values/values";
import { HttpClient } from "@angular/common/http";

@Component({
    selector: "ns-similarProducts",
    moduleId: module.id,
    templateUrl: "./similar-productAdmin.component.html",
    styleUrls: ["./similar-productAdmin.component.css"]
})

export class SimilarProductAdminComponent implements OnInit {

    similarProducts = [];
    product: Product;

    constructor(private router: Router, private userService: UserService, private http: HttpClient) {
        this.product = new Product();
        if (localstorage.getItem("adminToken") != null && localstorage.getItem("adminToken") != undefined && localstorage.getItem("adminId") != null && localstorage.getItem("adminId") != undefined) {
            this.getSimilarProducts();
        }
    }

    ngOnInit(): void {
    }

    getSimilarProducts() {
        if (localstorage.getItem("categoryId") != null && localstorage.getItem("categoryId") != undefined) {
            this.userService.showLoadingState(true);
            this.http
                .get(Values.BASE_URL + "similarProducts?_id=" + localstorage.getItem("categoryId"))
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
                                    weight: res.data[i].dimensions[0].value + " " + res.data[i].dimensions[0].unit,
                                    price: "Rs " + res.data[i].price.value,
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

    onEdit(product: Product) {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                "similarProductId": product._id,
                "classType": "similarProduct",
                "type": "edit"
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
        let navigationExtras: NavigationExtras = {
            queryParams: {
                "classType": "similarProduct"
            },
        };
        this.router.navigate(['./addProduct'], navigationExtras);
    }

    onProductInactive(product: Product) {
        this.product.status = "disabled";
        this.userService.showLoadingState(true);
        this.http
            .put(Values.BASE_URL + "similarProducts/update/" + product._id, this.product)
            .subscribe((res: any) => {
                if (res != null && res != undefined) {
                    if (res.isSuccess == true) {
                        this.userService.showLoadingState(false);
                        this.similarProducts = [];
                        this.getSimilarProducts();
                    }
                }
            }, error => {
                alert(error.error.error);
            });
    }

    onProductActive(product: Product) {
        this.product.status = "enabled";
        this.userService.showLoadingState(true);
        this.http
            .put(Values.BASE_URL + "similarProducts/update/" + product._id, this.product)
            .subscribe((res: any) => {
                if (res != null && res != undefined) {
                    if (res.isSuccess == true) {
                        this.userService.showLoadingState(false);
                        this.similarProducts = [];
                        this.getSimilarProducts();
                    }
                }
            }, error => {
                alert(error.error.error);
            });
    }
}
