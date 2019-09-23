import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { ActivatedRoute } from "@angular/router";
import { Values } from "~/app/values/values";
import { ImageSource, fromFile } from "tns-core-modules/image-source/image-source";
import { Folder, path, File } from "tns-core-modules/file-system";
import { CardView } from "nativescript-cardview";
import { registerElement } from "nativescript-angular/element-registry";
import { ImageCropper } from 'nativescript-imagecropper';
import { SimilarProduct } from "~/app/models/similarProduct.model";
import { ModalComponent } from "~/app/modals/modal.component";
import { session } from 'nativescript-background-http';
import { NavigationService } from "~/app/services/navigation.service";
import { Page } from "tns-core-modules/ui/page/page";
import { TextField } from "tns-core-modules/ui/text-field";

import * as camera from "nativescript-camera";
import * as permissions from "nativescript-permissions";
import * as imagepicker from "nativescript-imagepicker";

registerElement("CardView", () => CardView);

declare var android: any;

@Component({
    selector: "ns-addProduct",
    moduleId: module.id,
    templateUrl: "./add-product.component.html",
    styleUrls: ["./add-product.component.css"]
})

export class AddProductComponent implements OnInit {

    @ViewChild('selectDimensionDialog') selectDimensionDialog: ModalComponent;
    @ViewChild('photoUploadDialog') photoUploadDialog: ModalComponent;
    @ViewChild('uploadProgressDialog') uploadProgressDialog: ModalComponent;
    @ViewChild('warningDialog') warningDialog: ModalComponent;
    @ViewChild("brandTextField") brandTextField: ElementRef;


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
    product: any;
    similarProduct: any;
    imageUrl: any;
    productId: string;
    similarProductId: string;
    type: string;
    classType: string;
    showAddButton: boolean;
    errorMessage: string;
    file: any;
    name: string;
    extension: string;
    shouldImageUpdate: string;
    isRendering: boolean;
    isLoading: boolean;

    brandNameClass: boolean;
    productNameClass: boolean;
    weightClass: boolean;
    priceClass: boolean;
    headingClass: boolean;
    descriptionClass: boolean;
    private imageCropper: ImageCropper;
    isVisibleImage: boolean;
    uploadProgressValue: number;

    constructor(private route: ActivatedRoute, private routerExtensions: RouterExtensions, private navigationService: NavigationService, private page: Page) {

        this.page.actionBarHidden = true;
        this.isLoading = false;
        this.isRendering = false;
        this.imageCropper = new ImageCropper();
        this.imageUrl = null;
        this.uploadProgressValue = 10;

        this.similarProduct = new SimilarProduct();
        this.similarProduct.products = [];
        this.productImage = "res://add_image_icon";

        this.brandBorderColor = "white";
        this.nameBorderColor = "white";
        this.weightBorderColor = "white";
        this.priceBorderColor = "white";
        this.detailHeadingBorderColor = "white";
        this.detailDescriptionBorderColor = "white";
        this.showAddButton = true;
        this.errorMessage = "";

        this.extension = 'jpg';
        this.shouldImageUpdate = "true";
        this.isVisibleImage = true;

        this.navigationService.backTo = "homeAdmin";

        this.route.queryParams.subscribe(params => {
            if (params["product"] != undefined) {
                console.log('sdsadasd:::', params["product"])
                this.product = JSON.parse(params["product"]);
                console.log('pppppp:::', this.product)
            }
            if (params["similarProduct"] != undefined) {
                this.similarProduct = JSON.parse(params["similarProduct"]);
                console.log(this.similarProduct);
            }
            if (params["type"] != undefined) {
                this.type = params["type"];
            }
            if (params["classType"] != undefined) {
                this.classType = params["classType"];
            }
        });

        if (this.classType == "similarProduct") {

            if (this.similarProduct != undefined) {
                if (this.similarProduct._id) {
                    this.similarProductId = this.similarProduct._id;
                }
                if (this.similarProduct.image) {
                    this.isVisibleImage = false;
                    this.productImage = this.similarProduct.image;
                }
                if (this.similarProduct.brandName != undefined) {
                    this.brandNameClass = true;
                    this.brandName = this.similarProduct.brandName;
                } else {
                    this.brandNameClass = false;
                }
                if (this.similarProduct.name != undefined) {
                    this.productNameClass = true;
                    this.productName = this.similarProduct.name;
                } else {
                    this.productNameClass = false;
                }

                if (this.similarProduct.heading != undefined) {
                    this.headingClass = true;
                    this.detailHeading = this.similarProduct.heading;
                } else {
                    this.headingClass = false;
                }

                if (this.similarProduct.description != undefined) {
                    this.descriptionClass = true;
                    this.detailDescription = this.similarProduct.description;
                } else {
                    this.descriptionClass = false;
                }

                if (this.similarProduct.price != undefined) {
                    this.priceClass = true;
                    this.price = this.similarProduct.price;
                } else {
                    this.priceClass = false;
                }

                if (this.similarProduct.weight != undefined) {
                    this.weightClass = true;
                    this.weight = this.similarProduct.weightValue;
                } else {
                    this.weightClass = false;
                }

                if (this.similarProduct.weightUnit != undefined) {
                    this.weightDimension = this.similarProduct.weightUnit;
                }
            }
        }
        else {

            if (this.product != undefined) {
                console.log(this.product._id);
                if (this.product._id) {
                    this.productId = this.product._id;
                }
                if (this.product.image) {
                    this.isVisibleImage = false;
                    this.productImage = this.product.image;
                }
                if (this.product.brandName != undefined) {
                    this.brandNameClass = true;
                    this.brandName = this.product.brandName;
                } else {
                    this.brandNameClass = false;
                }
                if (this.product.name != undefined) {
                    this.productNameClass = true;
                    this.productName = this.product.name;
                } else {
                    this.productNameClass = false;
                }

                if (this.product.heading != undefined) {
                    this.headingClass = true;
                    this.detailHeading = this.product.heading;
                } else {
                    this.headingClass = false;
                }

                if (this.product.description != undefined) {
                    this.descriptionClass = true;
                    this.detailDescription = this.product.description;
                } else {
                    this.descriptionClass = false;
                }

                if (this.product.price != undefined) {
                    this.priceClass = true;
                    this.price = this.product.price;
                } else {
                    this.priceClass = false;
                }

                if (this.product.weightValue != undefined) {
                    this.weightClass = true;
                    this.weight = this.product.weightValue;
                } else {
                    this.weightClass = false;
                }
                if (this.product.weightUnit != undefined) {
                    this.weightDimension = this.product.weightUnit;
                }
            }
        }
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.isRendering = true;
        }, 50);
    }

    onBack() {
        this.routerExtensions.back();
    }

    onBrandTextChanged(args) {
        this.brandNameClass = true;
        this.brandName = args.object.text;
    }

    onNameTextChanged(args) {
        this.productNameClass = true;
        this.productName = args.object.text;
    }

    onWeightTextChanged(args) {
        this.weightClass = true;
        this.weight = args.object.text;
    }

    onPriceTextChanged(args) {
        this.priceClass = true;
        this.price = args.object.text;
    }

    onDetailHeadingTextChanged(args) {
        this.headingClass = true;
        this.detailHeading = args.object.text;
    }

    onDetailDescriptionTextChanged(args) {
        this.descriptionClass = true;
        this.detailDescription = args.object.text;
    }

    onUploadImage() {
        this.isVisibleImage = true;
        this.photoUploadDialog.show();
    }

    onGallery() {
        this.photoUploadDialog.hide();
        var that = this;
        let context = imagepicker.create({
            mode: "single"
        });
        permissions.requestPermission([android.Manifest.permission.CAMERA, android.Manifest.permission.WRITE_EXTERNAL_STORAGE])
            .then(() => {
                context
                    .authorize()
                    .then(() => {
                        return context.present();
                    })
                    .then(selection => {
                        selection.forEach(function (selected) {
                            let source = new ImageSource();
                            source.fromAsset(selected).then((source) => {
                                that.imageCropper.show(source, { lockSquare: true }).then((args: any) => {
                                    if (args.image !== null) {
                                        var folder: Folder = Folder.fromPath("/storage/emulated/0" + "/farmersHut");
                                        var file: File = File.fromPath(path.join(folder.path, 'FarmersHut.jpg'));
                                        args.image.saveToFile(file.path, 'jpg');
                                        that.file = "/storage/emulated/0/farmersHut/FarmersHut.jpg";
                                        that.name = that.file.substr(that.file.lastIndexOf("/") + 1);
                                        that.extension = that.name.substr(that.name.lastIndexOf(".") + 1);
                                        that.productImage = undefined;
                                        that.productImage = fromFile("/storage/emulated/0/farmersHut/FarmersHut.jpg");
                                        that.isVisibleImage = false;
                                        that.shouldImageUpdate = "true";
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
            });
    }

    onCamera() {
        this.photoUploadDialog.hide();
        if (camera.isAvailable()) {
            var that = this;
            permissions.requestPermission([android.Manifest.permission.CAMERA, android.Manifest.permission.WRITE_EXTERNAL_STORAGE])
                .then(() => {
                    camera.takePicture({ width: 512, height: 512, keepAspectRatio: true })
                        .then((selected) => {
                            let source = new ImageSource();
                            source.fromAsset(selected).then((source) => {
                                this.imageCropper.show(source, { lockSquare: true }).then((args: any) => {
                                    if (args.image !== null) {
                                        var folder: Folder = Folder.fromPath("/storage/emulated/0" + "/farmersHut");
                                        var file: File = File.fromPath(path.join(folder.path, 'FarmersHut.jpg'));
                                        args.image.saveToFile(file.path, 'jpg');
                                        that.file = "/storage/emulated/0/farmersHut/FarmersHut.jpg";
                                        that.name = that.file.substr(that.file.lastIndexOf("/") + 1);
                                        that.extension = that.name.substr(that.name.lastIndexOf(".") + 1);
                                        that.productImage = undefined;
                                        that.productImage = fromFile("/storage/emulated/0/farmersHut/FarmersHut.jpg");
                                        that.isVisibleImage = false;
                                        that.shouldImageUpdate = "true";
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

    onOK() {
        this.warningDialog.hide();
    }

    onOutsideClick() {
        this.photoUploadDialog.hide();
        this.selectDimensionDialog.hide();
    }

    onAddProduct() {
        if (this.productImage == null) {
            this.errorMessage = "Please select product image.";
            this.warningDialog.show();
        }
        else if (this.brandName == "") {
            this.errorMessage = "Please enter brand name.";
            this.warningDialog.show();
        }
        else if (this.productName == "") {
            this.errorMessage = "Please enter product name.";
            this.warningDialog.show();
        }
        else if (this.weight == "") {
            this.errorMessage = "Please enter weight.";
            this.warningDialog.show();
        }
        else if (this.price == "") {
            this.errorMessage = "Please enter price.";
            this.warningDialog.show();
        }
        else {
            this.isLoading = true;
            var that = this;
            var mimeType = "image/" + this.extension;
            var uploadSession = session('image-upload');
            if (that.type == "edit") {
                if (that.file == null) {
                    this.file = "/storage/emulated/0/farmersHut/FarmersHut.jpg";
                    this.shouldImageUpdate = "false";
                }
                if (that.classType == "similarProduct") {
                    var request = {
                        url: Values.BASE_URL + "similarProducts",
                        method: "POST",
                        headers: {
                            "Content-Type": "application/octet-stream",
                            "File-Name": "my file"
                        },
                        description: "{'uploading':" + "my file" + "}"
                    }
                    var price = that.price.toString();
                    const params = [
                        { name: "file", filename: that.file, mimeType: mimeType },
                        { name: "name", value: that.productName },
                        { name: "brand", value: that.brandName },
                        { name: "price.value", value: price },
                        { name: "price.currency", value: that.currency },
                        { name: "heading.title", value: that.detailHeading },
                        { name: "heading.description", value: that.detailDescription },
                        { name: "dimensions[value]", value: that.weight },
                        { name: "dimensions[unit]", value: that.weightDimension },
                        { name: "shouldImageUpdate", value: that.shouldImageUpdate },
                        { name: "isUpdate", value: "true" },
                        { name: "product_id", value: that.similarProductId }
                    ]
                    var task = uploadSession.multipartUpload(params, request);
                    task.on("responded", (e) => {
                        console.log("RESPONSE: " + e.data);
                        this.isLoading = false;
                        localStorage.setItem('fromSimilarProducts', 'true');
                        this.routerExtensions.back();
                    });
                    task.on("error", this.errorEvent);
                    task.on("complete", this.completeEvent);
                }
                else {
                    var request = {
                        url: Values.BASE_URL + "products",
                        method: "POST",
                        headers: {
                            "Content-Type": "application/octet-stream",
                            "File-Name": "my"
                        },
                        description: "{'uploading':" + "my" + "}"
                    }
                    var price = that.price.toString();
                    const params = [
                        { name: "file", filename: that.file, mimeType: mimeType },
                        { name: "name", value: that.productName },
                        { name: "brand", value: that.brandName },
                        { name: "price.value", value: price },
                        { name: "price.currency", value: that.currency },
                        { name: "heading.title", value: that.detailHeading },
                        { name: "heading.description", value: that.detailDescription },
                        { name: "dimensions[value]", value: that.weight },
                        { name: "dimensions[unit]", value: that.weightDimension },
                        { name: "shouldImageUpdate", value: that.shouldImageUpdate },
                        { name: "isUpdate", value: "true" },
                        { name: "product_id", value: that.productId },
                    ]
                    console.log(params);
                    console.log(request);
                    var task = uploadSession.multipartUpload(params, request);
                    task.on("responded", (e) => {
                        console.log("RESPONSE: " + e.data);
                        this.isLoading = false;
                        localStorage.setItem('fromHome', 'true');
                        this.routerExtensions.back();
                    });
                    task.on("error", this.errorEvent);
                    task.on("complete", this.completeEvent);
                }
            } else {
                if (that.classType == "similarProduct") {
                    if (localStorage.getItem("categoryId") != null && localStorage.getItem("categoryId") != undefined) {
                        var categoryId = localStorage.getItem("categoryId");
                    }
                    var request = {
                        url: Values.BASE_URL + "similarProducts",
                        method: "POST",
                        headers: {
                            "Content-Type": "application/octet-stream",
                            "File-Name": that.name
                        },
                        description: "{'uploading':" + that.name + "}"
                    }
                    const params = [
                        { name: "file", filename: that.file, mimeType: mimeType },
                        { name: "category._id", value: categoryId },
                        { name: "name", value: that.productName },
                        { name: "brand", value: that.brandName },
                        { name: "price.value", value: that.price },
                        { name: "price.currency", value: that.currency },
                        { name: "heading.title", value: that.detailHeading },
                        { name: "heading.description", value: that.detailDescription },
                        { name: "dimensions[value]", value: that.weight },
                        { name: "dimensions[unit]", value: that.weightDimension }
                    ]
                    var task = uploadSession.multipartUpload(params, request);
                    task.on("responded", (e) => {
                        console.log("RESPONSE: " + e.data);
                        this.isLoading = false;
                        localStorage.setItem('fromSimilarProducts', 'true');
                        this.routerExtensions.back();
                    });
                    task.on("error", this.errorEvent);
                    task.on("complete", this.completeEvent);
                }
                else {
                    var request = {
                        url: Values.BASE_URL + "products",
                        method: "POST",
                        headers: {
                            "Content-Type": "application/octet-stream",
                            "File-Name": that.name
                        },
                        description: "{'uploading':" + that.name + "}"
                    }
                    const params = [
                        { name: "file", filename: that.file, mimeType: mimeType },
                        { name: "name", value: that.productName },
                        { name: "brand", value: that.brandName },
                        { name: "price.value", value: that.price },
                        { name: "price.currency", value: that.currency },
                        { name: "heading.title", value: that.detailHeading },
                        { name: "heading.description", value: that.detailDescription },
                        { name: "dimensions[value]", value: that.weight },
                        { name: "dimensions[unit]", value: that.weightDimension }
                    ]
                    var task = uploadSession.multipartUpload(params, request);
                    task.on("progress", (e) => {
                        this.uploadProgressDialog.show();
                    });
                    task.on("responded", (e) => {
                        console.log("RESPONSE: " + e.data);
                        this.isLoading = false;
                        localStorage.setItem('fromHome', 'true');
                        this.routerExtensions.back();
                    });
                    task.on("error", this.errorEvent);
                    task.on("complete", this.completeEvent);
                }
            }
        }
    }

    respondedEvent(e) {
        console.log("RESPONSE: " + e.data);
        this.isLoading = false;
        localStorage.setItem('fromHome', 'true');
        this.routerExtensions.back();
    }

    similarProductRespondedEvent(e) {
        console.log("RESPONSE: " + e.data);
        this.isLoading = false;
        localStorage.setItem('fromSimilarProducts', 'true');
        this.routerExtensions.back();
    }

    errorEvent(e) {
        console.log("Error is: " + JSON.stringify(e));
    }

    completeEvent(e) {
        console.log("Completed :" + JSON.stringify(e));
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
