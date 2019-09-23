import { Component, OnInit } from "@angular/core";
import { SelectedIndexChangedEventData } from "tns-core-modules/ui/tab-view";
import { Product } from "~/app/models/product.model";
import { Cart } from "~/app/models/cart.model";
import { HttpClient } from "@angular/common/http";
import { Values } from "~/app/values/values";
import { UserService } from '../../services/user.service';
import { Category } from "../../models/category.model";
import { RouterExtensions } from "nativescript-angular/router";
import { NavigationService } from "~/app/services/navigation.service";
import { Page } from "tns-core-modules/ui/page/page";
import { BackgroundHttpService } from "~/app/services/background.http.service";

import * as localstorage from "nativescript-localstorage";
import * as Toast from 'nativescript-toast';


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
    isCartCount: boolean;
    product: Product;
    cart: Cart;
    cartCount: number;
    category: Category;
    tabSelectedIndex: number;
    isRenderingSlider: boolean;
    isRenderingTabView: boolean;
    pullRefreshPage;
    pageNo: number;


    mainInit = true;
    categoryPageNo = 1;
    categoryInit = true;
    isRendering: boolean;
    isLoading: boolean;
    hasBeenHitOnce: boolean;
    errorMessage: string;
    isScrolling: boolean;
    scrollingTimeout;


    constructor(private navigationService: NavigationService, private http: HttpClient, private userService: UserService, private routerExtensions: RouterExtensions, private page: Page, private backgroundHttpService: BackgroundHttpService) {
        this.page.actionBarHidden = true;

        this.sliderImage1 = "res://slider_background";
        this.sliderImage2 = "res://slider_background";
        this.sliderImage3 = "res://slider_background";
        this.sliderImage4 = "res://slider_background";
        this.isRenderingSlider = false;
        this.isRenderingTabView = false;
        this.product = new Product();
        this.cart = new Cart();
        this.cart.product = new Product();
        this.category = new Category();
        this.products = [];
        this.navigationService.backTo = undefined;
        this.pageNo = 1;
        this.isRendering = false;
        this.isLoading = false;
        this.hasBeenHitOnce = false;
        this.errorMessage = "";
        this.isScrolling = false;

        this.userService.showLoadingState(false);
        this.userService.activeScreen("homeUser");

        this.page.on('navigatedTo', (data) => {
            console.log("ddata:::", data.isBackNavigation);
            console.log("navigating to this page:::", data.context);
            if (data.isBackNavigation) {
                this.pageNo = 0;
                this.userService.activeScreen("homeUser");
                this.updateCartCount();
            }
        })
        this.updateCartCount();

    }

    ngOnInit(): void {
        setTimeout(() => {
            this.isRendering = true;
        }, 50);
        if (localstorage.getItem("userToken") != null && localstorage.getItem("userToken") != undefined && localstorage.getItem("userId") != null && localstorage.getItem("userId") != undefined) {
            if (this.getProducts()) {
                this.getCategory()
            }
        }
    }

    onLoadMoreMainItems() {
        console.log("111")
        if (!this.mainInit) {
            this.pageNo = this.pageNo + 1;
            this.getProducts();
        }
        this.mainInit = false;
    }

    onLoadMoreCategoryItems() {
        console.log("111")
        if (!this.categoryInit) {
            this.categoryPageNo = this.categoryPageNo + 1;
            this.getCategory();
        }
        this.categoryInit = false;
    }

    onGridViewScroll() {
        if (this.isScrolling) {
            clearTimeout(this.scrollingTimeout)
            this.scrollingTimeout = setTimeout(() => {
                this.isScrolling = false;
            }, 1)
        } else {
            this.isScrolling = true;
            this.scrollingTimeout = setTimeout(() => {
                this.isScrolling = false;
            }, 1)
        }
    }

    getProducts() {
        this.http
            .get(Values.BASE_URL + `products?status=enabled&pageNo=${this.pageNo}&items=5`)
            .subscribe((res: any) => {
                if (res != null && res != undefined) {
                    if (res.isSuccess == true && res.data && res.data.products) {
                        for (var i = 0; i < res.data.products.length; i++) {
                            this.products.push({
                                _id: res.data.products[i]._id,
                                status: res.data.products[i].status,
                                image: res.data.products[i].image.resize_url,
                                brandName: res.data.products[i].brand,
                                heading: res.data.products[i].heading.title,
                                name: res.data.products[i].name,
                                weight: res.data.products[i].dimensions[0].value + " " + res.data.products[i].dimensions[0].unit,
                                price: res.data.products[i].price.value,
                                description: res.data.products[i].heading.description
                            })
                        }
                        this.isRenderingSlider = true;     //remove it
                        this.mainInit = true;
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
        return true
    }

    getCategory() {
        this.http
            .get(Values.BASE_URL + `categories?status=active&pageNo=${this.categoryPageNo}&items=8`)
            .subscribe((res: any) => {
                console.log('RES:::CATEGORY:::', res)
                if (res != null && res != undefined) {
                    if (res.isSuccess == true) {
                        if (res.data && res.data.categories) {
                            for (var i = 0; i < res.data.categories.length; i++) {
                                this.productCategories.push({
                                    _id: res.data.categories[i]._id,
                                    image: res.data.categories[i].image.resize_url,
                                    name: res.data.categories[i].name,
                                })
                            }
                            this.isRenderingTabView = true;
                            this.categoryInit = true;
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

        return true;
    }

    onSelectedIndexChanged(args: SelectedIndexChangedEventData) {
        if (args.oldIndex !== -1) {
            const newIndex = args.newIndex;
            if (newIndex === 0) {
                this.tabSelectedIndex = 0;
            } else if (newIndex === 1) {
                this.tabSelectedIndex = 1;
            }
        }
    }

    updateCartCount() {
        var storedCart = JSON.parse(localstorage.getItem('cart'));
        console.log(storedCart);
        if (storedCart != null && storedCart.length != null && storedCart.length != 0) {
            this.isCartCount = true;
            this.cartCount = storedCart.length;
        }
        else {
            this.isCartCount = false;
        }
    }

    onViewDetail(product: Product) {
        this.routerExtensions.navigate(['/productDetail'], {
            queryParams: {
                "product": JSON.stringify(product),
                "classType": "product"
            }
        });

    }

    onCategory(category: Category) {
        this.routerExtensions.navigate(['/similarProductUser'], {
            queryParams: {
                "categoryId": category._id,
            },
        });
    }

    onProfile() {
        this.routerExtensions.navigate(['/profile']);
    }

    onCartClick() {
        this.routerExtensions.navigate(['/cart']);
    }

    productExistance = async (product: Product): Promise<boolean> => {

        var storedCartProducts = JSON.parse(localstorage.getItem('cart'));

        return new Promise<boolean>((resolve, reject) => {
            for (var i = 0; i < storedCartProducts.length; i++) {
                if (product._id == storedCartProducts[i]._id) {
                    this.cart.product.quantity = "1";
                    alert("Product already in cart, Please increase quantity in cart");
                    resolve(true);
                    return;
                }
            }
            reject(false);
        })
    }

    onAddCart(product: Product) {

        this.userService.showLoadingState(true);
        this.cart.product._id = product._id;
        console.log(product._id);

        var storedCartProducts = JSON.parse(localstorage.getItem('cart'));

        if (storedCartProducts.length != 0) {
            this.productExistance(product).then((res) => {

            }, error => {
                this.cart.product.quantity = "1";
                storedCartProducts.push(new Product(product));
                localstorage.setItem(JSON.stringify(storedCartProducts));
                this.updateCart();
            })

        }
        else {
            this.cart.product.quantity = "1";
            storedCartProducts.push(new Product(product));
            localstorage.setItem(JSON.stringify(storedCartProducts));
            this.updateCart();
        }

        this.updateCartCount();
    }

    updateCart() {
        var tempCart = [];

        if (!this.hasBeenHitOnce) {

            this.hasBeenHitOnce = true;
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
                            localstorage.setItem('cart', JSON.stringify(tempCart));
                            Toast.makeText("Product is added to cart!!!", "long").show();
                            this.updateCartCount();
                            this.cart = new Cart();
                            this.cart.product = new Product();
                        }
                    }
                    this.hasBeenHitOnce = false;
                }, error => {
                    this.hasBeenHitOnce = false;
                    console.log(error.error.error);
                });

        }
    }

}
