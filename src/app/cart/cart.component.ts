import { Component, OnInit, ViewChild } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { SelectedIndexChangedEventData } from "tns-core-modules/ui/tab-view";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import { ModalComponent } from "../modals/modal.component";
import * as Toast from 'nativescript-toast';
import { Color } from "tns-core-modules/color/color";
import * as localstorage from "nativescript-localstorage";
import { HttpClient } from "@angular/common/http";
import { Values } from "~/app/values/values";
import { UserService } from '../services/user.service';
import { Cart } from "~/app/models/cart.model";
import { Product } from "~/app/models/product.model";
import { Order } from "~/app/models/order.model";
// import { MyOrders } from "~/app/models/myOrders.model";

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

    cartProducts;
    totalAmount: string;
    cart: Cart;
    product: Product;
    order: Order;
    // myOrders: MyOrders;

    constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private userService: UserService) {
        this.cartProducts = [];
        this.cart = new Cart();
        this.cart.product = new Product();
        this.product = new Product();
        this.cart.order = new Order();

        if (localstorage.getItem("cartId") != null &&
            localstorage.getItem("cartId") != undefined &&
            localstorage.getItem("userToken") != null &&
            localstorage.getItem("userToken") != undefined &&
            localstorage.getItem("userId") != null &&
            localstorage.getItem("userId") != undefined) {
            this.refreshCartPage();
        }
    }

    ngOnInit(): void {

    }

    onBack() {
        this.router.navigate(['/homeUser']);
    }

    onRemoveItem(product: Product) {
        this.cart.product._id = product._id;
        this.cart.product.quantity = "0";
        if (product.isSimilarProduct == true) {
            this.cart.product.isSimilarProduct = product.isSimilarProduct;
        } else {
            this.cart.product.isSimilarProduct = false;
        }
        this.updateCartQuantity();
    }

    onPlus(product: Product) {
        this.userService.showLoadingState(true);
        this.cart.product._id = product._id;
        if (product.isSimilarProduct == true) {
            this.cart.product.isSimilarProduct = product.isSimilarProduct;
            this.http
                .get(Values.BASE_URL + "carts/" + localstorage.getItem("cartId"))
                .subscribe((res: any) => {
                    if (res != null && res != undefined) {
                        if (res.isSuccess == true) {
                            if (res.data.products.length != 0) {
                                for (var i = 0; i < res.data.products.length; i++) {
                                    if (product._id == res.data.products[i]._id) {
                                        var quantity = parseInt(res.data.products[i].quantity) + 1;
                                        this.cart.product.quantity = quantity.toString();
                                        this.userService.showLoadingState(false);
                                        this.updateCartQuantity();
                                    }
                                }
                            }
                        }
                    }
                }, error => {
                    this.userService.showLoadingState(false);
                    console.log(error.error.error);
                });
        }
        else {
            this.cart.product.isSimilarProduct = false;
            this.cart.product.isSimilarProduct = product.isSimilarProduct;
            this.http
                .get(Values.BASE_URL + "carts/" + localstorage.getItem("cartId"))
                .subscribe((res: any) => {
                    if (res != null && res != undefined) {
                        if (res.isSuccess == true) {
                            if (res.data.products.length != 0) {
                                for (var i = 0; i < res.data.products.length; i++) {
                                    if (product._id == res.data.products[i]._id) {
                                        var quantity = parseInt(res.data.products[i].quantity) + 1;
                                        this.cart.product.quantity = quantity.toString();
                                        this.userService.showLoadingState(false);
                                        this.updateCartQuantity();
                                    }
                                }
                            }
                        }
                    }
                }, error => {
                    this.userService.showLoadingState(false);
                    console.log(error.error.error);
                });
        }
    }

    onMinus(product: Product) {
        this.userService.showLoadingState(true);
        this.cart.product._id = product._id;
        if (product.isSimilarProduct == true) {
            console.log(product.isSimilarProduct);
            this.cart.product.isSimilarProduct = product.isSimilarProduct;
            this.http
                .get(Values.BASE_URL + "carts/" + localstorage.getItem("cartId"))
                .subscribe((res: any) => {
                    if (res != null && res != undefined) {
                        if (res.isSuccess == true) {
                            if (res.data.products.length != 0) {
                                for (var i = 0; i < res.data.products.length; i++) {
                                    if (product._id == res.data.products[i]._id) {
                                        var quantity = parseInt(res.data.products[i].quantity) - 1;
                                        this.cart.product.quantity = quantity.toString();
                                        this.userService.showLoadingState(false);
                                        this.updateCartQuantity();
                                    }
                                }
                            }
                        }
                    }
                }, error => {
                    this.userService.showLoadingState(false);
                    console.log(error.error.error);
                });
        }
        else {
            this.cart.product.isSimilarProduct = false;
            this.http
                .get(Values.BASE_URL + "carts/" + localstorage.getItem("cartId"))
                .subscribe((res: any) => {
                    if (res != null && res != undefined) {
                        if (res.isSuccess == true) {
                            if (res.data.products.length != 0) {
                                for (var i = 0; i < res.data.products.length; i++) {
                                    if (product._id == res.data.products[i]._id) {
                                        var quantity = parseInt(res.data.products[i].quantity) - 1;
                                        this.cart.product.quantity = quantity.toString();
                                        this.userService.showLoadingState(false);
                                        this.updateCartQuantity();
                                    }
                                }
                            }
                        }
                    }
                }, error => {
                    this.userService.showLoadingState(false);
                    console.log(error.error.error);
                });
        }
    }

    updateCartQuantity() {
        this.userService.showLoadingState(true);
        this.http
            .put(Values.BASE_URL + "carts/update/" + localstorage.getItem("cartId"), this.cart)
            .subscribe((res: any) => {
                if (res != null && res != undefined) {
                    if (res.isSuccess == true) {
                        this.userService.showLoadingState(false);
                        this.refreshCartPage();
                    }
                }
            }, error => {
                this.userService.showLoadingState(false);
                console.log(error.error.error);
            });
    }

    refreshCartPage() {
        this.userService.showLoadingState(true);
        this.http
            .get(Values.BASE_URL + "carts/" + localstorage.getItem("cartId"))
            .subscribe((res: any) => {
                if (res != null && res != undefined) {
                    if (res.isSuccess == true) {
                        this.userService.showLoadingState(false);
                        if (res.data.products.length > 0) {
                            this.cartProducts = [];
                            for (var i = 0; i < res.data.products.length; i++) {
                                if (res.data.products[i].isSimilarProduct) {
                                    var productType = res.data.products[i].isSimilarProduct;
                                }
                                this.cartProducts.push({
                                    _id: res.data.products[i]._id,
                                    isSimilarProduct: productType,
                                    image: res.data.products[i].image.url,
                                    fullName: res.data.products[i].name,
                                    quantity: res.data.products[i].quantity,
                                    totalPrice: "RS" + " " + res.data.products[i].total,
                                    weight: res.data.products[i].dimensions[0].value + " " + res.data.products[i].dimensions[0].unit,
                                    price: "Rs " + res.data.products[i].price.value
                                })
                            }
                            this.totalAmount = res.data.grandTotal;
                        }
                    }
                }
            }, error => {
                this.userService.showLoadingState(false);
                console.log(error.error.error);
            });
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
        if (localstorage.getItem("userToken") != null && localstorage.getItem("userToken") != undefined && localstorage.getItem("userId") != null && localstorage.getItem("userId") != undefined) {
            this.userService.showLoadingState(true);
            this.http
                .get(Values.BASE_URL + "users/" + localstorage.getItem("userId"))
                .subscribe((res: any) => {
                    if (res != "" && res != undefined) {
                        if (res.isSuccess == true) {
                            this.userService.showLoadingState(false);
                            if (res.data.address.line1 == null && res.data.address.line1 == undefined) {
                                alert("Please add your address first.");
                            }
                            else {
                                this.placeOrderDialog.show();
                            }
                        }
                    }
                }, error => {
                    alert(error.error.error);
                });
        }
    }

    onConfirm() {
        this.userService.showLoadingState(true);
        this.cart.order._id = localstorage.getItem("cartId");
        this.http
            .post(Values.BASE_URL + "orders/", this.cart)
            .subscribe((res: any) => {
                if (res != "" && res != undefined) {
                    if (res.isSuccess == true) {
                        console.log(res);
                        // localstorage.setItem('orderId', res.data._id);
                        this.placeOrderDialog.hide();
                        this.router.navigate(['/homeUser']);
                        Toast.makeText("Order successfully placed!!!", "long").show();
                    }
                }
            }, error => {
                alert(error.error.error);
            });
    }

    onCancel() {
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
