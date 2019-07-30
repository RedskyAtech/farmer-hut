import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import * as imagepicker from "nativescript-imagepicker";
import { ModalComponent } from "../modals/modal.component";
import * as Toast from 'nativescript-toast';
import { Values } from "~/app/values/values";
import { Product } from "~/app/models/product.model";
import { Heading } from "~/app/models/heading.model";
import { Image } from "~/app/models/image.model";
import { HttpClient } from "@angular/common/http";
import { ImageSource } from "tns-core-modules/image-source/image-source";
import { ImageAsset } from "tns-core-modules/image-asset/image-asset";
import { Price } from "../models/price.model";
import { UserService } from '../services/user.service';
import { CardView } from "nativescript-cardview";
import { registerElement } from "nativescript-angular/element-registry";
import { PhotoEditor, PhotoEditorControl } from "nativescript-photo-editor";
import { ImageCropper } from 'nativescript-imagecropper';
import * as camera from "nativescript-camera";
import * as permissions from "nativescript-permissions";
import { SimilarProduct } from "../models/similarProduct.model";
import { Category } from "../models/category.model";


registerElement("CardView", () => CardView);

@Component({
    selector: "ns-addProduct",
    moduleId: module.id,
    templateUrl: "./add-product.component.html",
    styleUrls: ["./add-product.component.css"]
})

export class AddProductComponent implements OnInit {

    // @ViewChild("dd", { read: true, static: false }) dropDown: ElementRef;

    @ViewChild('selectDimensionDialog') selectDimensionDialog: ModalComponent;
    @ViewChild('photoUploadDialog') photoUploadDialog: ModalComponent;

    productImage: string | ImageSource;
    brandBorderColor: string;
    nameBorderColor: string;
    weightBorderColor: string;
    priceBorderColor: string;
    detailHeadingBorderColor: string;
    detailDescriptionBorderColor: string;
    brandHint = "Brand name"
    nameHint = "Product name";
    weightHint = "Weight";
    priceHint = "Price (in rupees)";
    detailHeadingHint = "Detail heading";
    detailDescriptionHint = "Detail Description";
    brandName = "";
    productName = "";
    weight = "";
    price = "";
    detailHeading = "";
    detailDescription = "";
    weightDimension = "kg";
    currency = "Rs";
    product: Product;
    similarProduct: SimilarProduct;
    imageUrl: any;
    productId: string;
    similarProductId: string;
    type: string;
    classType: string;

    private imageCropper: ImageCropper;

    constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private userService: UserService) {

        this.imageCropper = new ImageCropper();
        this.imageUrl = null;

        this.product = new Product();
        this.similarProduct = new SimilarProduct();
        this.similarProduct.products = [];
        this.product.heading = new Heading();
        this.product.image = new Image();
        this.product.category = new Category();
        this.product.dimensions = [];
        this.product.price = new Price();
        this.productImage = "res://image_icon";

        this.brandBorderColor = "white";
        this.nameBorderColor = "white";
        this.weightBorderColor = "white";
        this.priceBorderColor = "white";
        this.detailHeadingBorderColor = "white";
        this.detailDescriptionBorderColor = "white";

        this.route.queryParams.subscribe(params => {
            if (params["productId"] != undefined) {
                this.productId = params["productId"];
            }
            if (params["similarProductId"] != undefined) {
                this.similarProductId = params["similarProductId"];
            }
            if (params["type"] != undefined) {
                this.type = params["type"];
            }
            if (params["classType"] != undefined) {
                this.classType = params["classType"];
            }
        });

        if (this.classType == "similarProduct") {
            if (this.similarProductId != undefined) {
                this.userService.showLoadingState(true);
                this.http
                    .get(Values.BASE_URL + "similarProducts/" + this.similarProductId)
                    .subscribe((res: any) => {
                        if (res != null && res != undefined) {
                            if (res.isSuccess == true) {
                                this.userService.showLoadingState(false);
                                this.productImage = res.data.image.url;
                                this.brandName = res.data.brand;
                                this.productName = res.data.name;
                                this.detailHeading = res.data.heading.title;
                                this.detailDescription = res.data.heading.description;
                                this.weight = res.data.dimensions[0].value;
                                this.price = res.data.price.value;
                            }
                        }
                    }, error => {
                        this.userService.showLoadingState(false);
                        alert(error.error.error);
                    });
            }
        }
        else {
            if (this.productId != undefined) {
                this.userService.showLoadingState(true);
                this.http
                    .get(Values.BASE_URL + "products/" + this.productId)
                    .subscribe((res: any) => {
                        if (res != null && res != undefined) {
                            if (res.isSuccess == true) {
                                this.userService.showLoadingState(false);
                                this.productImage = res.data.image.url;
                                this.brandName = res.data.brand;
                                this.productName = res.data.name;
                                this.detailHeading = res.data.heading.title;
                                this.detailDescription = res.data.heading.description;
                                this.weight = res.data.dimensions[0].value;
                                this.price = res.data.price.value;
                            }
                        }
                    }, error => {
                        alert(error.error.error);
                    });
            }
        }
    }

    ngOnInit(): void {
    }

    onBack() {
        this.router.navigate(['/homeAdmin']);
    }

    onBrandTextChanged(args) {
        this.brandBorderColor = "#E98A02";
        this.nameBorderColor = "white";
        this.weightBorderColor = "white";
        this.priceBorderColor = "white";
        this.detailHeadingBorderColor = "white";
        this.detailDescriptionBorderColor = "white";
        this.brandName = args.object.text;
    }

    onNameTextChanged(args) {
        this.brandBorderColor = "white";
        this.nameBorderColor = "#E98A02";
        this.weightBorderColor = "white";
        this.priceBorderColor = "white";
        this.detailHeadingBorderColor = "white";
        this.detailDescriptionBorderColor = "white";
        this.productName = args.object.text;
    }
    onWeightTextChanged(args) {
        this.brandBorderColor = "white";
        this.nameBorderColor = "white";
        this.weightBorderColor = "#E98A02";
        this.priceBorderColor = "white";
        this.detailHeadingBorderColor = "white";
        this.detailDescriptionBorderColor = "white";
        this.weight = args.object.text;
    }
    onPriceTextChanged(args) {
        this.brandBorderColor = "white";
        this.nameBorderColor = "white";
        this.weightBorderColor = "white";
        this.priceBorderColor = "#E98A02";
        this.detailHeadingBorderColor = "white";
        this.detailDescriptionBorderColor = "white";
        this.price = args.object.text;
    }
    onDetailHeadingTextChanged(args) {
        this.brandBorderColor = "white";
        this.nameBorderColor = "white";
        this.weightBorderColor = "white";
        this.priceBorderColor = "white";
        this.detailHeadingBorderColor = "#E98A02";
        this.detailDescriptionBorderColor = "white";
        this.detailHeading = args.object.text;
    }
    onDetailDescriptionTextChanged(args) {
        this.brandBorderColor = "white";
        this.nameBorderColor = "white";
        this.weightBorderColor = "white";
        this.priceBorderColor = "white";
        this.detailHeadingBorderColor = "white";
        this.detailDescriptionBorderColor = "#E98A02";
        this.detailDescription = args.object.text;
    }

    onUploadImage() {
        this.photoUploadDialog.show();
    }

    onGallery() {
        this.photoUploadDialog.hide();
        var that = this;
        let context = imagepicker.create({
            mode: "single"
        });
        context
            .authorize()
            .then(() => {
                return context.present();
            })
            .then(selection => {
                selection.forEach(function (selected) {
                    var image = new ImageSource();
                    image.fromAsset(selected).then((source) => {
                        that.imageCropper.show(source, { lockSquare: true }).then((args) => {
                            if (args.image !== null) {
                                that.imageUrl = 'data:image/png;base64,' + args.image.toBase64String('png', 100);
                                that.productImage = that.imageUrl;
                            }
                        })
                            .catch(function (e) {
                                console.log(e);
                            });
                    }).catch((err) => {
                        console.log("Error -> " + err.message);
                    });
                });
            });
    }

    onCamera() {
        this.photoUploadDialog.hide();
        if (camera.isAvailable()) {
            var that = this;
            permissions.requestPermission([android.Manifest.permission.CAMERA, android.Manifest.permission.WRITE_EXTERNAL_STORAGE])
                .then(() => {
                    camera.takePicture({ width: 512, height: 512, keepAspectRatio: true })
                        .then((imageAsset) => {
                            let source = new ImageSource();
                            source.fromAsset(imageAsset).then((source) => {
                                this.imageCropper.show(source, { lockSquare: true }).then((args) => {
                                    if (args.image !== null) {
                                        that.imageUrl = 'data:image/png;base64,' + args.image.toBase64String('png', 100);
                                        that.productImage = that.imageUrl;
                                    }
                                })
                                    .catch(function (e) {
                                        console.log(e);
                                    });
                            });
                        }).catch((err) => {
                            console.log("Error -> " + err.message);
                        });
                })
                .catch(function () {
                    alert("User denied permissions");
                });
        }
    }

    onOutsideClick() {
        this.photoUploadDialog.hide();
        this.selectDimensionDialog.hide();
    }


    onAddProduct() {
        if (this.productImage == "res://image_icon") {
            alert("Please select product image!!!");
        }
        else if (this.brandName == "") {
            alert("Please enter brand name!!!");
        }
        else if (!(this.brandName.match("^[a-zA-Z ]*$"))) {
            alert("Brand name contains characters only!!!");
        }
        else if (this.productName == "") {
            alert("Please enter product name!!!")
        }
        else if (!(this.productName.match("^[a-zA-Z ]*$"))) {
            alert("Product name contains characters only!!!");
        }
        else if (this.weight == "") {
            alert("Please enter weight!!!");
        }
        else if (this.price == "") {
            alert("Please enter price!!!");
        }
        else if (this.detailHeading == "") {
            alert("Please enter detail heading!!!");
        }
        else if (this.detailDescription == "") {
            alert("Please enter detail description!!!");
        }
        else if (this.imageUrl == "") {
            alert("Please select product image!!!");
        }
        else {
            this.userService.showLoadingState(true);
            this.product.brand = this.brandName;
            this.product.name = this.productName;
            this.product.image.url = this.imageUrl;
            this.product.dimensions.push({ 'value': this.weight, 'unit': this.weightDimension });
            this.product.price.value = this.price;
            this.product.price.currency = this.currency;
            this.product.heading.title = this.detailHeading;
            this.product.heading.description = this.detailDescription;
            if (this.type == "edit") {
                if (this.classType == "similarProduct") {
                    this.http
                        .put(Values.BASE_URL + "similarProducts/update/" + this.similarProductId, this.product)
                        .subscribe((res: any) => {
                            if (res != null && res != undefined) {
                                if (res.isSuccess == true) {
                                    this.userService.showLoadingState(false);
                                    this.router.navigate(['./similarProductAdmin']);
                                }
                            }
                        }, error => {
                            alert(error.error.error);
                        });
                }
                else {
                    this.http
                        .put(Values.BASE_URL + "products/update/" + this.productId, this.product)
                        .subscribe((res: any) => {
                            if (res != null && res != undefined) {
                                if (res.isSuccess == true) {
                                    this.userService.showLoadingState(false);
                                    this.router.navigate(['./homeAdmin']);
                                }
                            }
                        }, error => {
                            this.userService.showLoadingState(false);
                            alert(error.error.error);
                        });
                }
            } else {
                if (this.classType == "similarProduct") {
                    if (localStorage.getItem("categoryId") != null && localStorage.getItem("categoryId") != undefined) {
                        var categoryId = localStorage.getItem("categoryId");
                        this.product.category._id = categoryId;
                    }
                    this.http
                        .post(Values.BASE_URL + "similarProducts", this.product)
                        .subscribe((res: any) => {
                            if (res != null && res != undefined) {
                                if (res.isSuccess == true) {
                                    this.userService.showLoadingState(false);
                                    this.router.navigate(['./similarProductAdmin']);
                                }
                            }
                        }, error => {
                            this.userService.showLoadingState(false);
                            alert(error.error.error);
                        });
                }
                else {
                    this.http
                        .post(Values.BASE_URL + "products", this.product)
                        .subscribe((res: any) => {
                            if (res != null && res != undefined) {
                                if (res.isSuccess == true) {
                                    this.userService.showLoadingState(false);
                                    this.router.navigate(['./homeAdmin']);
                                }
                            }
                        }, error => {
                            this.userService.showLoadingState(false);
                            alert(error.error.error);
                        });
                }
            }
        }
    }

    onWeightDimension() {
        this.selectDimensionDialog.show();
    }

    onKg() {
        this.weightDimension = "kg";
        this.selectDimensionDialog.hide();
    }

    onGm() {
        this.weightDimension = "gm";
        this.selectDimensionDialog.hide();
    }

    onLtr() {
        this.weightDimension = "ltr";
        this.selectDimensionDialog.hide();
    }

    onMl() {
        this.weightDimension = "ml";
        this.selectDimensionDialog.hide();
    }

    onPiece() {
        this.weightDimension = "piece";
        this.selectDimensionDialog.hide();
    }
}
