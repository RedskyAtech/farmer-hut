import { Component, OnInit, AfterViewInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { SelectedIndexChangedEventData } from "tns-core-modules/ui/tab-view";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import * as localstorage from "nativescript-localstorage";
import { HttpClient } from "@angular/common/http";
import { Values } from "~/app/values/values";
import { UserService } from '../services/user.service';

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
    cartCount: boolean;

    constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private userService: UserService) {

        this.route.queryParams.subscribe(params => {
            this.productId = params["productId"];
        });

        this.userService.showLoadingState(true);

        this.http
            .get(Values.BASE_URL + "products/" + this.productId)
            .subscribe((res: any) => {
                if (res != null && res != undefined) {
                    if (res.isSuccess == true) {
                        console.log(res);
                        this.userService.showLoadingState(false);
                        this.image = res.data.image.url;
                        this.brandName = res.data.brand;
                        this.fullName = res.data.name;
                        this.detailHeading = res.data.heading.title;
                        this.detailDescription = res.data.heading.description;
                        this.quantity = res.data.dimensions[0].value + " " + res.data.dimensions[0].unit;
                        this.price = res.data.price.currency + "" + res.data.price.value;
                        this.userService.showLoadingState(false);
                    }
                }
            }, error => {
                this.userService.showLoadingState(false);
                alert(error.error.error);
            });

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
        this.addToCartButton = false;
        this.addedCartButton = true;
        this.cartCount = true;
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
