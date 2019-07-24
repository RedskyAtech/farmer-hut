import { Component, OnInit, ViewChild } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { SelectedIndexChangedEventData } from "tns-core-modules/ui/tab-view";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import { ModalComponent } from "../modals/modal.component";
import * as Toast from 'nativescript-toast';
import { Color } from "tns-core-modules/color/color";

declare const android: any;
declare const CGSizeMake: any;

@Component({
    selector: "ns-cart",
    moduleId: module.id,
    templateUrl: "./cart.component.html",
    styleUrls: ["./cart.component.css"]
})

export class CartComponent implements OnInit {

    @ViewChild('placeOrderDialog') placeOrderDialog: ModalComponent;

    cartProducts = [];
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
        this.cartProducts.push({ id: 0, image: "res://item_1", totalPrice: "100", fullName: "Bee Fruity Red Gum Honey", quantity: "100 gm", price: "RS 100", noOfProduct: 1 });
        this.cartProducts.push({ id: 1, image: "res://item_2", totalPrice: "150", fullName: "Bee Fruity Red Gum Honey", quantity: "200 gm", price: "RS 150", noOfProduct: 1 });
        this.cartProducts.push({ id: 2, image: "res://item_3", totalPrice: "350", fullName: "Bee Fruity Red Gum Honey", quantity: "400 gm", price: "RS 350", noOfProduct: 1 });
        this.cartProducts.push({ id: 3, image: "res://item_4", totalPrice: "450", fullName: "Bee Fruity Red Gum Honey", quantity: "500 gm", price: "RS 450", noOfProduct: 1 });
        this.cartProducts.push({ id: 4, image: "res://item_5", totalPrice: "850", fullName: "Bee Fruity Red Gum Honey", quantity: "1 kg", price: "RS 850", noOfProduct: 1 });
        this.cartProducts.push({ id: 5, image: "res://item_1", totalPrice: "100", fullName: "Bee Fruity Red Gum Honey", quantity: "100 gm", price: "RS 100", noOfProduct: 1 });
        this.cartProducts.push({ id: 6, image: "res://item_2", totalPrice: "150", fullName: "Bee Fruity Red Gum Honey", quantity: "200 gm", price: "RS 150", noOfProduct: 1 });
        this.cartProducts.push({ id: 7, image: "res://item_3", totalPrice: "350", fullName: "Bee Fruity Red Gum Honey", quantity: "400 gm", price: "RS 350", noOfProduct: 1 });
        this.cartProducts.push({ id: 8, image: "res://item_4", totalPrice: "450", fullName: "Bee Fruity Red Gum Honey", quantity: "500 gm", price: "RS 450", noOfProduct: 1 });
    }

    onBack() {
        this.router.navigate(['/homeUser']);
    }

    onRemoveItem(item: any) {
        this.cartProducts.splice(item.id, 1);
        for (let i = item.id; i < this.cartProducts.length; i++) {
            this.cartProducts[i].id = i;
        }
    }

    onPlus(item: any) {
        this.cartProducts[item.id].noOfProduct++;
    }

    onMinus(item: any) {
        if (this.cartProducts[item.id].noOfProduct > 1) {
            this.cartProducts[item.id].noOfProduct--;
        }
    }

    onAddress() {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                "from": "cart"
            },
        };
        this.router.navigate(['/address'], navigationExtras);
    }

    onOrderItem() {
        this.placeOrderDialog.show();
    }

    onConfirm() {
        this.placeOrderDialog.hide();
        this.router.navigate(['/homeUser']);
        Toast.makeText("Order successfully placed!!!", "long").show();
    }

    onReject() {
        this.placeOrderDialog.hide();
        // Toast.makeText("Order is rejected!!!", "long").show();
    }

    protected get shadowColor(): Color {
        return new Color('#888888')
    }

    protected get shadowOffset(): number {
        return 2.0
    }

    onDialogLoaded(args: any) {
        var placeOrder = <any>args.object;

        setTimeout(() => {
            if (placeOrder.android) {
                let nativeGridMain = placeOrder.android;
                var shape = new android.graphics.drawable.GradientDrawable();
                shape.setShape(android.graphics.drawable.GradientDrawable.RECTANGLE);
                shape.setColor(android.graphics.Color.parseColor('white'));
                shape.setCornerRadius(20)
                nativeGridMain.setBackgroundDrawable(shape);
                nativeGridMain.setElevation(20)
            } else if (placeOrder.ios) {
                let nativeGridMain = placeOrder.ios;

                nativeGridMain.layer.shadowColor = this.shadowColor.ios.CGColor;
                nativeGridMain.layer.shadowOffset = CGSizeMake(0, this.shadowOffset);
                nativeGridMain.layer.shadowOpacity = 0.5
                nativeGridMain.layer.shadowRadius = 5.0
                nativeGridMain.layer.shadowRadius = 5.0
            }

            // this.changeDetector.detectChanges();
        }, 400)

    }
}
