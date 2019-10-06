import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { ActivatedRoute } from "@angular/router";
import { Values } from "~/app/values/values";
import { UserService } from '../../services/user.service';
import { Cart } from '~/app/models/cart.model';
import { Product } from "../../models/product.model";
import { NavigationService } from "~/app/services/navigation.service";

import { Page } from "tns-core-modules/ui/page/page";
import { BackgroundHttpService } from "~/app/services/background.http.service";

import * as localstorage from "nativescript-localstorage";
import * as Toast from 'nativescript-toast';
import { HttpClient } from "@angular/common/http";
import { CartService } from "~/app/services/cart.service";



@Component({
    selector: "ns-productDetail",
    moduleId: module.id,
    templateUrl: "./product-detail.component.html",
    styleUrls: ["./product-detail.component.css"]
})
export class ProductDetailComponent implements OnInit {
    id: string;
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
    cartCount: number | string;
    isCartCount: boolean;
    cart: Cart;
    classType: string;
    isRenderingDetail: boolean;
    isRendering: boolean;
    hasBeenHitOnce: boolean;

    genricProduct: any;

    constructor(private route: ActivatedRoute, private navigationService: NavigationService, private routerExtensions: RouterExtensions, private userService: UserService, private page: Page, private backgroundHttpService: BackgroundHttpService, private http: HttpClient, private cartService: CartService) {
        this.isRendering = false;
        this.page.actionBarHidden = true;
        this.hasBeenHitOnce = false;
        this.userService.activeScreen('');
        this.route.queryParams.subscribe(params => {
            if (params["product"] != undefined) {
                this.genricProduct = JSON.parse(params["product"]);
                console.log('Got:::', params["product"])
            }
            if (params["classType"] != undefined) {
                this.classType = params["classType"];
            }
        });


        localstorage.setItem('genricProduct', JSON.stringify(this.genricProduct))
        console.log('GENPRO:::', localstorage.getItem('genricProduct'))

        this.page.on('navigatedTo', (data) => {
            if (data.isBackNavigation) {
                this.updateCartCount();
                this.refreshCartPage();
                this.genricProduct = JSON.parse(localstorage.getItem('genricProduct'))
            }
        })
        this.userService.showLoadingState(true);
        this.cart = new Cart();
        this.cart.product = new Product();
        this.isRenderingDetail = false;
        this.navigationService.backTo = "homeUser";

        if (this.classType == "similarProduct") {

            this.id = this.genricProduct._id;
            this.image = this.genricProduct.image;
            this.brandName = this.genricProduct.brandName;
            this.fullName = this.genricProduct.name;
            this.detailHeading = this.genricProduct.heading;
            this.detailDescription = this.genricProduct.description;
            this.quantity = this.genricProduct.weight;
            this.price = this.genricProduct.price

            this.cart.product.isSimilarProduct = true;

            this.isRenderingDetail = true;
        }
        else {
            this.id = this.genricProduct._id;
            this.image = this.genricProduct.image;
            this.brandName = this.genricProduct.brandName;
            this.fullName = this.genricProduct.name;
            this.detailHeading = this.genricProduct.heading;
            this.detailDescription = this.genricProduct.description;
            this.quantity = this.genricProduct.weight;
            this.price = this.genricProduct.price;

            this.cart.product.isSimilarProduct = false;

            this.isRenderingDetail = true;
        }

        if (this.cartStatus == true) {
            this.addToCartButton = false;
            this.addedCartButton = true;
        }
        else {
            this.addToCartButton = true;
            this.addedCartButton = false;
        }

        this.cartService.cartCountObservable.subscribe((count: string) => {
            if (count == "0") {
                this.isCartCount = false;
            }
            else {
                this.cartCount = count;
                this.isCartCount = true;
            }
        });
        this.updateCartCount();
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.isRendering = true;
        }, 50);
    }

    refreshCartPage() {
        var tempCart = [];
        this.http
            .get(Values.BASE_URL + "carts/" + localstorage.getItem("cartId"))
            .subscribe((res: any) => {
                if (res != null && res != undefined) {
                    if (res.isSuccess == true) {
                        // this.updateCartCount();
                        if (res.data.products.length > 0) {
                            for (var i = 0; i < res.data.products.length; i++) {
                                tempCart.push(new Product(res.data.products[i]));
                            }
                            // this.cartService.setCartCount(res.data.products.length.toString())
                            this.cartService.getCartCount();
                            this.cartService.cartCountObservable.subscribe((count: string) => {
                                if (count != undefined) {
                                    this.cartCount = count;
                                }
                            });
                            localstorage.setItem('cart', JSON.stringify(tempCart));
                        }
                    }
                }
            });
    }

    onBack() {
        this.routerExtensions.back();
    }

    onCartClick() {
        this.routerExtensions.navigate(['/cart'], {
        });
    }


    productExistance = async (product: Product): Promise<boolean> => {

        var storedCartProducts = JSON.parse(localstorage.getItem('cart'));

        return new Promise<boolean>((resolve, reject) => {
            for (var i = 0; i < storedCartProducts.length; i++) {
                if (product._id == storedCartProducts[i]._id) {
                    var quantity = parseInt(storedCartProducts[i].quantity) + 1;
                    this.cart.product.quantity = quantity.toString();
                    alert("Product already in cart, Please increase quantity in cart");
                    resolve(true);
                    return;
                }
            }
            reject(false);
        })
    }

    onAddToCart() {

        this.userService.showLoadingState(true);
        this.cart.product._id = this.id;
        console.log(this.id);

        var storedCartProducts = JSON.parse(localstorage.getItem('cart'));

        if (storedCartProducts.length != 0) {
            this.productExistance(this.genricProduct).then((res) => {

            }, error => {
                this.cart.product.quantity = "1";
                this.cart.product.isSimilarProduct = this.genricProduct.isSimilarProduct;
                storedCartProducts.push(new Product(this.genricProduct));
                // this.cartService.setCartCount(storedCartProducts.length.toString())
                this.cartService.getCartCount();
                this.cartService.cartCountObservable.subscribe((count: string) => {
                    if (count != undefined) {
                        this.cartCount = count;
                    }
                });
                localstorage.setItem(JSON.stringify(storedCartProducts));
                this.updateCart();
            })

        }
        else {
            this.cart.product.quantity = "1";
            this.cart.product.isSimilarProduct = this.genricProduct.isSimilarProduct;
            storedCartProducts.push(new Product(this.genricProduct));
            // this.cartService.setCartCount(storedCartProducts.length.toString())
            this.cartService.getCartCount();
            this.cartService.cartCountObservable.subscribe((count: string) => {
                if (count != undefined) {
                    this.cartCount = count;
                }
            });
            localstorage.setItem(JSON.stringify(storedCartProducts));
            this.updateCart();
        }

        // this.updateCartCount();
    }


    updateCart(): Promise<boolean> {

        return new Promise((resolve, reject) => {


            var tempCart = [];

            if (!this.hasBeenHitOnce) {

                this.hasBeenHitOnce = true;
                console.log("CURCART:::,", this.cart)
                this.backgroundHttpService
                    .put(Values.BASE_URL + `carts/update/${localstorage.getItem('cartId')}`, {}, this.cart)
                    .then((res: any) => {
                        if (res != null && res != undefined) {
                            if (res.isSuccess == true) {
                                if (res.data && res.data.products) {
                                    for (var i = 0; i < res.data.products.length; i++) {
                                        tempCart.push(new Product(res.data.products[i]));
                                    }
                                }
                                this.cartService.setCartCount(res.data.products.length.toString())
                                localstorage.setItem('cart', JSON.stringify(tempCart));
                                Toast.makeText("Product is added to cart!!!", "long").show();
                                // this.updateCartCount();
                                this.cart = new Cart();
                                this.cart.product = new Product();
                            }
                        }
                        resolve(true)
                        this.hasBeenHitOnce = false;
                    }, error => {
                        reject(false);
                        this.hasBeenHitOnce = false;
                        if (error.error.error == undefined) {
                            alert("Something went wrong!!! May be your network connection is low.");
                        }
                        else {
                            alert(error.error.error);
                        }
                    });
            }
        })
    }


    updateCartCount() {
        var storedCart = JSON.parse(localstorage.getItem('cart'));

        if (storedCart.length != 0) {
            // this.cartService.setCartCount(storedCart.length.toString())
            this.cartService.getCartCount();
            this.cartService.cartCountObservable.subscribe((count: string) => {
                if (count != undefined) {
                    this.cartCount = count;
                }
            });
            this.isCartCount = true;
            this.cartCount = storedCart.length;
        } else {
            this.isCartCount = false;
        }
    }

    onBuyNow() {

        this.userService.showLoadingState(true);
        this.cart.product._id = this.id;

        var storedCartProducts = JSON.parse(localstorage.getItem('cart'));

        if (storedCartProducts.length != 0) {
            for (var i = 0; i < storedCartProducts.length; i++) {
                if (this.id == storedCartProducts[i]._id) {
                    // this.cartService.setCartCount(storedCartProducts.length.toString())
                    this.cartService.getCartCount();
                    this.cartService.cartCountObservable.subscribe((count: string) => {
                        if (count != undefined) {
                            this.cartCount = count;
                        }
                    });
                    this.routerExtensions.navigate(['/cart']);
                    return;
                }
            }
            this.cart.product.quantity = "1";
            this.cart.product.isSimilarProduct = this.genricProduct.isSimilarProduct;
            storedCartProducts.push(new Product(this.genricProduct));
            // this.cartService.setCartCount(storedCartProducts.length.toString())
            this.cartService.getCartCount();
            this.cartService.cartCountObservable.subscribe((count: string) => {
                if (count != undefined) {
                    this.cartCount = count;
                }
            });
            localstorage.setItem(JSON.stringify(storedCartProducts));
            this.updateCart().then((res: boolean) => {
                if (res) {
                    this.routerExtensions.navigate(['/cart']);
                }
            }, error => {
                Toast.makeText('Some error occured, Please try again');
            });
        }
        else {
            this.cart.product.quantity = "1";
            this.cart.product.isSimilarProduct = this.genricProduct.isSimilarProduct;
            storedCartProducts.push(new Product(this.genricProduct));
            // this.cartService.setCartCount(storedCartProducts.length.toString())
            this.cartService.getCartCount();
            this.cartService.cartCountObservable.subscribe((count: string) => {
                if (count != undefined) {
                    this.cartCount = count;
                }
            });
            localstorage.setItem(JSON.stringify(storedCartProducts));
            this.updateCart().then((res: boolean) => {
                if (res) {
                    this.routerExtensions.navigate(['/cart']);
                }
            }, error => {
                Toast.makeText('Some error occured, Please try again');
            });
        }
    }

}
