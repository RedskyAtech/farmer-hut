import { Component, OnInit, ViewChild } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { ModalComponent } from "../../modals/modal.component";
import { Color } from "tns-core-modules/color/color";
import { HttpClient } from "@angular/common/http";
import { Values } from "~/app/values/values";
import { UserService } from '../../services/user.service';
import { Cart } from "~/app/models/cart.model";
import { Product } from "~/app/models/product.model";
import { Order } from "~/app/models/order.model";
import { NavigationService } from "~/app/services/navigation.service";
import { Page } from "tns-core-modules/ui/page/page";

import * as Toast from 'nativescript-toast';
import * as localstorage from "nativescript-localstorage";
import { NavigationExtras } from "@angular/router";
import { BackgroundHttpService } from "~/app/services/background.http.service";

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
    @ViewChild('viewAddressDialog') viewAddressDialog: ModalComponent;

    cartProducts: Array<any>;
    totalAmount: string;
    cart: Cart;
    product: Product;
    order: Order;
    isRendering: boolean;
    address: string;
    mapAddress: string;
    addressButtonText: string;
    isRenderingMessage: boolean;
    isRenderingWhole: boolean;

    constructor(private routerExtensions: RouterExtensions, private navigationService: NavigationService, private http: HttpClient, private userService: UserService, private page: Page, private backgroundHttpService: BackgroundHttpService) {
        this.page.actionBarHidden = true;
        this.isRenderingWhole = false;
        this.cartProducts = [];
        this.cart = new Cart();
        this.cart.product = new Product();
        this.product = new Product();
        this.cart.order = new Order();
        this.isRendering = false;
        this.mapAddress = "";
        this.address = "";
        this.isRenderingMessage = false;
        this.userService.activeScreen('');
        this.navigationService.backTo = "homeUser";
    }

    ngOnInit(): void {
        if (localstorage.getItem("cartId") != null &&
            localstorage.getItem("cartId") != undefined &&
            localstorage.getItem("userToken") != null &&
            localstorage.getItem("userToken") != undefined &&
            localstorage.getItem("userId") != null &&
            localstorage.getItem("userId") != undefined) {
            this.refreshCartPage();
        }
        setTimeout(() => {
            this.isRenderingWhole = true;
        }, 100)
    }

    onBack() {
        this.routerExtensions.back();
    }

    onRemoveItem(product: Product) {
        var storedCart = JSON.parse(localstorage.getItem('cart'));
        console.trace('CARTTTTT:::', product)


        this.cart.product._id = product._id;
        this.cart.product.quantity = "0";

        var index = this.cartProducts.indexOf(product)
        this.cartProducts.splice(index, 1);

        if (product.isSimilarProduct) {
            this.cart.product.isSimilarProduct = true;
        }

        if (this.cartProducts.length == 0) {
            this.isRenderingMessage = true;
        }
        if (storedCart.length != 0) {
            for (var i = 0; i < storedCart.length; i++) {
                if (product._id == storedCart[i]._id) {
                    storedCart[i].quantity = "0";
                    localstorage.setItem('cart', JSON.stringify(storedCart));
                    this.notifyUpdateCartQuantity();
                }
            }
        }
        this.totalAmount = this.getGrandTotal().toString();

        this.notifyUpdateCartQuantity();

    }

    onPlus(product: Product) {
        this.cart.product._id = product._id;

        var storedCart = JSON.parse(localstorage.getItem('cart'));
        console.log("STO::C::", storedCart)

        var index = this.cartProducts.indexOf(product)

        this.cartProducts[index].quantity = (parseInt(this.cartProducts[index].quantity) + 1).toString();
        this.cartProducts[index].totalPrice = this.cartProducts[index].totalPrice + this.cartProducts[index].price;

        if (product.isSimilarProduct == true) {
            this.cart.product.isSimilarProduct = product.isSimilarProduct;
            if (storedCart.length != 0) {
                for (var i = 0; i < storedCart.length; i++) {
                    if (product._id == storedCart[i]._id) {
                        var quantity = parseInt(storedCart[i].quantity) + 1;
                        this.cart.product.quantity = quantity.toString();
                        storedCart[i].quantity = quantity;
                        storedCart[i].totalPrice = storedCart[i].totalPrice + storedCart[i].price;
                        localstorage.setItem('cart', JSON.stringify(storedCart));
                        this.notifyUpdateCartQuantity();
                    }
                }
            }
        }
        else {
            this.cart.product.isSimilarProduct = false;
            if (storedCart.length != 0) {
                for (var i = 0; i < storedCart.length; i++) {
                    if (product._id == storedCart[i]._id) {
                        var quantity = parseInt(storedCart[i].quantity) + 1;
                        this.cart.product.quantity = quantity.toString();
                        storedCart[i].quantity = quantity;
                        storedCart[i].totalPrice = storedCart[i].totalPrice + storedCart[i].price;
                        localstorage.setItem('cart', JSON.stringify(storedCart));
                        this.notifyUpdateCartQuantity();
                    }
                }
            }
        }
        this.totalAmount = this.getGrandTotal().toString();
        console.log('Prices:::', this.totalAmount, typeof (this.totalAmount))
    }

    onMinus(product: Product) {
        this.cart.product._id = product._id;

        var storedCart = JSON.parse(localstorage.getItem('cart'));

        var index = this.cartProducts.indexOf(product)

        if (parseInt(this.cartProducts[index].quantity) - 1 == 0) {
            this.onRemoveItem(product);
        } else {
            this.cartProducts[index].quantity = (parseInt(this.cartProducts[index].quantity) - 1).toString();
            this.cartProducts[index].totalPrice = this.cartProducts[index].totalPrice - this.cartProducts[index].price;
        }

        if (product.isSimilarProduct == true) {
            console.log(product.isSimilarProduct);
            this.cart.product.isSimilarProduct = product.isSimilarProduct;

            if (storedCart.length != 0) {
                for (var i = 0; i < storedCart.length; i++) {
                    if (product._id == storedCart[i]._id) {
                        var quantity = parseInt(storedCart[i].quantity) - 1;
                        this.cart.product.quantity = quantity.toString();
                        storedCart[i].quantity = quantity;
                        storedCart[i].totalPrice = storedCart[i].totalPrice - storedCart[i].price;
                        localstorage.setItem('cart', JSON.stringify(storedCart));
                        this.notifyUpdateCartQuantity();
                    }
                }
            }
        }
        else {
            this.cart.product.isSimilarProduct = false;

            if (storedCart.length != 0) {
                for (var i = 0; i < storedCart.length; i++) {
                    if (product._id == storedCart[i]._id) {
                        var quantity = parseInt(storedCart[i].quantity) - 1;
                        this.cart.product.quantity = quantity.toString();
                        storedCart[i].quantity = quantity;
                        storedCart[i].totalPrice = storedCart[i].totalPrice - storedCart[i].price;
                        localstorage.setItem('cart', JSON.stringify(storedCart));
                        this.notifyUpdateCartQuantity();
                    }
                }
            }
        }
        this.totalAmount = this.getGrandTotal().toString();
        console.log('Prices:::', this.totalAmount, typeof (this.totalAmount))
    }

    notifyUpdateCartQuantity() {
        var tempCart = [];
        console.log("SENTCART:::", this.cart);
        this.backgroundHttpService
            .put(Values.BASE_URL + "carts/update/" + localstorage.getItem("cartId"), {}, this.cart)
            .then((res: any) => {
                if (res != null && res != undefined) {
                    if (res.isSuccess == true) {
                        if (res.data && res.data.products) {
                            for (var i = 0; i < res.data.products.length; i++) {
                                tempCart.push(new Product(res.data.products[i]));
                            }
                        }
                        localstorage.setItem('cart', JSON.stringify(tempCart));
                        this.totalAmount = this.getGrandTotal().toString();
                    }
                }
            }, error => {
                this.totalAmount = this.getGrandTotal().toString();
                console.log(error.error.error);
            });
    }

    refreshCartPage() {
        var tempCart = [];
        this.http
            .get(Values.BASE_URL + "carts/" + localstorage.getItem("cartId"))
            .subscribe((res: any) => {
                if (res != null && res != undefined) {
                    if (res.isSuccess == true) {
                        if (res.data.products.length > 0) {
                            console.trace('GOTPRO:::', res.data.products)
                            this.cartProducts = [];
                            for (var i = 0; i < res.data.products.length; i++) {
                               
                                this.cartProducts.push({
                                    _id: res.data.products[i]._id,
                                    isSimilarProduct: res.data.products[i].isSimilarProduct,
                                    image: res.data.products[i].image.resize_url,
                                    fullName: res.data.products[i].name,
                                    quantity: res.data.products[i].quantity,
                                    totalPrice: res.data.products[i].total,
                                    weight: res.data.products[i].dimensions[0].value + " " + res.data.products[i].dimensions[0].unit,
                                    price: res.data.products[i].price.value
                                })
                                tempCart.push(new Product(res.data.products[i]));
                            }
                            localstorage.setItem('cart', JSON.stringify(tempCart));
                            this.totalAmount = res.data.grandTotal;
                            this.http
                                .get(Values.BASE_URL + "users/" + localstorage.getItem("userId"))
                                .subscribe((res: any) => {
                                    if (res != "" && res != undefined) {
                                        if (res.isSuccess == true) {
                                            this.userService.showLoadingState(false);
                                            if (res.data.deliveryAddress.line1 != null && res.data.deliveryAddress.line1 != undefined) {
                                                this.address = res.data.deliveryAddress.line1;
                                                this.mapAddress = res.data.deliveryAddress.line2;
                                                this.addressButtonText = "Change";
                                            }
                                            else {
                                                this.addressButtonText = "Enter";
                                            }
                                        }
                                    }
                                    this.isRendering = true;
                                }, error => {
                                    this.isRendering = true;
                                    if (error.error.error == undefined) {
                                        alert("Something went wrong!!! May be your network connection is low.");
                                    }
                                    else {
                                        alert(error.error.error);
                                    }
                                });
                        }
                        else {
                            this.isRenderingMessage = true;
                        }
                    }
                }
            }, error => {
                this.userService.showLoadingState(false);
                if (error.error.error == undefined) {
                    alert("Something went wrong!!! May be your network connection is low.");
                }
                else {
                    alert(error.error.error);
                }
            });
    }

    onViewAddress() {
        if (localstorage.getItem("address") != null && localstorage.getItem("address") != undefined && localstorage.getItem("mapAddress") != null && localstorage.getItem("mapAddress") != undefined) {
            this.mapAddress = localstorage.getItem("mapAddress");
            this.address = localstorage.getItem("address");
        }
        if (this.mapAddress != "" && this.address != "") {
            this.viewAddressDialog.show();
        }
        else {
            alert("Please select delivery address first");
        }
    }

    onAddress() {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                "from": "cart"
            },
        };
        this.routerExtensions.navigate(['/address'], navigationExtras);
    }

    onOrderItem() {
        if (localstorage.getItem("userToken") != null && localstorage.getItem("userToken") != undefined && localstorage.getItem("userId") != null && localstorage.getItem("userId") != undefined) {
            this.getAddress();
        }
    }

    getAddress() {
        this.userService.showLoadingState(true);
        this.http
            .get(Values.BASE_URL + "users/" + localstorage.getItem("userId"))
            .subscribe((res: any) => {
                if (res != "" && res != undefined) {
                    if (res.isSuccess == true) {
                        this.userService.showLoadingState(false);
                        if (res.data.deliveryAddress.line1 == null && res.data.deliveryAddress.line1 == undefined) {
                            alert("Please add your delivery address first.");
                        }
                        else {
                            this.placeOrderDialog.show();
                        }
                    }
                }
            }, error => {
                if (error.error.error == undefined) {
                    alert("Something went wrong!!! May be your network connection is low.");
                }
                else {
                    alert(error.error.error);
                }
            });
    }

    onConfirm() {
        this.userService.showLoadingState(true);
        this.cart.order._id = localstorage.getItem("cartId");

        this.http
            .post(Values.BASE_URL + "orders/", this.cart)
            .subscribe((res: any) => {
                if (res != "" && res != undefined) {
                    if (res.isSuccess == true) {
                        this.placeOrderDialog.hide();
                        localstorage.setItem('cart', "[]");
                        this.routerExtensions.navigate(['/homeUser'], {
                            clearHistory: true,
                        });
                        Toast.makeText("Order successfully placed!!!", "long").show();
                        this.userService.showLoadingState(true);
                    }
                }
            }, error => {
                if (error.error.error == undefined) {
                    alert("Something went wrong!!! May be your network connection is low.");
                }
                else {
                    alert(error.error.error);
                }
            });
    }

    onOrderCancel() {
        this.placeOrderDialog.hide();
    }
    onAddressCancel() {
        this.viewAddressDialog.hide();
    }

    protected get shadowColor(): Color {
        return new Color('#888888')
    }

    protected get shadowOffset(): number {
        return 2.0
    }

    onDialogLoaded(args: any) {
        var dialog = <any>args.object;

        setTimeout(() => {
            if (dialog.android) {
                let nativeGridMain = dialog.android;
                var shape = new android.graphics.drawable.GradientDrawable();
                shape.setShape(android.graphics.drawable.GradientDrawable.RECTANGLE);
                shape.setColor(android.graphics.Color.parseColor('white'));
                shape.setCornerRadius(20)
                nativeGridMain.setBackgroundDrawable(shape);
                nativeGridMain.setElevation(20)
            } else if (dialog.ios) {
                let nativeGridMain = dialog.ios;

                nativeGridMain.layer.shadowColor = this.shadowColor.ios.CGColor;
                nativeGridMain.layer.shadowOffset = CGSizeMake(0, this.shadowOffset);
                nativeGridMain.layer.shadowOpacity = 0.5
                nativeGridMain.layer.shadowRadius = 5.0
                nativeGridMain.layer.shadowRadius = 5.0
            }
        }, 400)

    }

    getGrandTotal(): number {
        var storedCart = JSON.parse(localstorage.getItem('cart'));
        var grandTotal = 0;

        for (var i = 0; i < storedCart.length; i++) {
            for (var j = 0; j < parseInt(storedCart[i].quantity); j++) {
                console.log('Prices:::', storedCart[i].price, typeof (storedCart[i].price))
                grandTotal = grandTotal + storedCart[i].price.value;
            }
        }
        return grandTotal;
    }
}
