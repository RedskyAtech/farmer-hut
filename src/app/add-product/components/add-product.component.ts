import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import * as imagepicker from "nativescript-imagepicker";
import { Values } from "~/app/values/values";
import { Product } from "~/app/models/product.model";
import { Heading } from "~/app/models/heading.model";
import { Image } from "~/app/models/image.model";
import { HttpClient } from "@angular/common/http";
import { ImageSource, fromBase64, fromFile } from "tns-core-modules/image-source/image-source";
import { Folder, path, knownFolders, File } from "tns-core-modules/file-system";
import { CardView } from "nativescript-cardview";
import { registerElement } from "nativescript-angular/element-registry";
import { ImageCropper } from 'nativescript-imagecropper';
import * as camera from "nativescript-camera";
import * as permissions from "nativescript-permissions";
import { SimilarProduct } from "~/app/models/similarProduct.model";
import { Category } from "~/app/models/category.model";
import { Price } from "~/app/models/price.model";
import { ModalComponent } from "~/app/modals/modal.component";
import { UserService } from "~/app/services/user.service";
import { session, Request } from 'nativescript-background-http';
import * as Toast from 'nativescript-toast';
import { NavigationService } from "~/app/services/navigation.service";

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
    @ViewChild('warningDialog') warningDialog: ModalComponent;

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
    showAddButton: boolean;
    errorMessage: string;
    file: any;
    name: string;
    extension: string;
    shouldImageUpdate: string;

    private imageCropper: ImageCropper;

    constructor(private route: ActivatedRoute, private routerExtensions: RouterExtensions, private navigationService: NavigationService, private http: HttpClient, private userService: UserService) {

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

        this.userService.showLoadingState(false);
        this.navigationService.backTo = "homeAdmin";

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
        this.routerExtensions.navigate(['/homeAdmin'], {
            clearHistory: true
        });
    }

    onBrandTextChanged(args) {
        this.brandBorderColor = "#00C012";
        this.nameBorderColor = "white";
        this.weightBorderColor = "white";
        this.priceBorderColor = "white";
        this.detailHeadingBorderColor = "white";
        this.detailDescriptionBorderColor = "white";
        this.brandName = args.object.text;
    }

    onNameTextChanged(args) {
        this.brandBorderColor = "white";
        this.nameBorderColor = "#00C012";
        this.weightBorderColor = "white";
        this.priceBorderColor = "white";
        this.detailHeadingBorderColor = "white";
        this.detailDescriptionBorderColor = "white";
        this.productName = args.object.text;
    }

    onWeightTextChanged(args) {
        this.brandBorderColor = "white";
        this.nameBorderColor = "white";
        this.weightBorderColor = "#00C012";
        this.priceBorderColor = "white";
        this.detailHeadingBorderColor = "white";
        this.detailDescriptionBorderColor = "white";
        this.weight = args.object.text;
    }

    onPriceTextChanged(args) {
        this.brandBorderColor = "white";
        this.nameBorderColor = "white";
        this.weightBorderColor = "white";
        this.priceBorderColor = "#00C012";
        this.detailHeadingBorderColor = "white";
        this.detailDescriptionBorderColor = "white";
        this.price = args.object.text;
    }

    onDetailHeadingTextChanged(args) {
        this.brandBorderColor = "white";
        this.nameBorderColor = "white";
        this.weightBorderColor = "white";
        this.priceBorderColor = "white";
        this.detailHeadingBorderColor = "#00C012";
        this.detailDescriptionBorderColor = "white";
        this.detailHeading = args.object.text;
    }

    onDetailDescriptionTextChanged(args) {
        this.brandBorderColor = "white";
        this.nameBorderColor = "white";
        this.weightBorderColor = "white";
        this.priceBorderColor = "white";
        this.detailHeadingBorderColor = "white";
        this.detailDescriptionBorderColor = "#00C012";
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
            // alert("Please select product image!!!");
        }
        else if (this.brandName == "") {
            this.errorMessage = "Please enter brand name.";
            this.warningDialog.show();
            // alert("Please enter brand name!!!");
        }
        else if (this.productName == "") {
            this.errorMessage = "Please enter product name.";
            this.warningDialog.show();
            // alert("Please enter product name!!!")
        }
        else if (this.weight == "") {
            this.errorMessage = "Please enter weight.";
            this.warningDialog.show();
            // alert("Please enter weight!!!");
        }
        else if (this.price == "") {
            this.errorMessage = "Please enter price.";
            this.warningDialog.show();
            // alert("Please enter price!!!");
        }
        else {
            this.userService.showLoadingState(true);
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
                    task.on("responded", this.respondedEvent);
                    task.on("error", this.errorEvent);
                    task.on("complete", this.completeEvent);
                    setTimeout(() => {
                        this.userService.showLoadingState(false);
                        this.routerExtensions.navigate(['./similarProductAdmin'], {
                            clearHistory: true,
                        });
                    }, 10000);
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
                    var task = uploadSession.multipartUpload(params, request);
                    task.on("responded", this.respondedEvent);
                    task.on("error", this.errorEvent);
                    task.on("complete", this.completeEvent);
                    setTimeout(() => {
                        this.userService.showLoadingState(false);
                        this.routerExtensions.navigate(['./homeAdmin'], {
                            clearHistory: true,
                        });
                    }, 10000);
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
                    task.on("responded", this.respondedEvent);
                    task.on("error", this.errorEvent);
                    task.on("complete", this.completeEvent);
                    setTimeout(() => {
                        this.userService.showLoadingState(false);
                        this.routerExtensions.navigate(['./similarProductAdmin'], {
                            clearHistory: true,
                        });
                    }, 10000);
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
                    task.on("responded", this.respondedEvent);
                    task.on("error", this.errorEvent);
                    task.on("complete", this.completeEvent);
                    setTimeout(() => {
                        this.userService.showLoadingState(false);
                        this.routerExtensions.navigate(['./homeAdmin'], {
                            clearHistory: true,
                        });
                    }, 10000);

                }
            }
        }
    }

    respondedEvent(e) {
        // var that = this;
        console.log("RESPONSE: " + e.data);
        this.userService.showLoadingState(false);
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
