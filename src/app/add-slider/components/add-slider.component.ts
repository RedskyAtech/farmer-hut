import { Component, OnInit, ViewChild } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { ModalComponent } from "../../modals/modal.component";
import { ImageCropper } from 'nativescript-imagecropper';
import { ImageSource, fromFile } from "tns-core-modules/image-source/image-source";
import { Values } from "~/app/values/values";
import { UserService } from "../../services/user.service";
import { Product } from "../../models/product.model";
import { Image } from "../../models/image.model";
import { NavigationService } from "~/app/services/navigation.service";
import { Page } from "tns-core-modules/ui/page/page";
import { Folder, path, File } from "tns-core-modules/file-system";
import { session } from 'nativescript-background-http';

import * as localstorage from "nativescript-localstorage";
import * as BitmapFactory from "nativescript-bitmap-factory"
import * as camera from "nativescript-camera";
import * as permissions from "nativescript-permissions";
import * as imagepicker from "nativescript-imagepicker";

declare var android: any;

@Component({
    selector: "ns-addSlider",
    moduleId: module.id,
    templateUrl: "./add-slider.component.html",
    styleUrls: ["./add-slider.component.css"]
})

export class AddSliderComponent implements OnInit {

    @ViewChild('photoUploadDialog') photoUploadDialog: ModalComponent;
    @ViewChild('warningDialog') warningDialog: ModalComponent;
    @ViewChild('uploadProgressDialog') uploadProgressDialog: ModalComponent;

    sliderImage: string | ImageSource;
    private imageCropper: ImageCropper;
    imageUrl: any;
    product: Product;
    showAddButton: boolean;
    errorMessage: string;
    isRendering: boolean;
    isLoading: boolean;
    file: any;
    name: string;
    extension: string;
    shouldImageUpdate: string;
    fileId: string;
    isVisibleImage: boolean
    hasBeenHit: boolean;
    uploadProgressValue: number;
    networkError: boolean;

    constructor(private navigationService: NavigationService, private routerExtensions: RouterExtensions, private userService: UserService, private page: Page) {
        this.page.actionBarHidden = true;
        this.isLoading = false;
        this.isRendering = false;
        this.imageCropper = new ImageCropper();
        this.imageUrl = null;
        this.sliderImage = "";
        this.isVisibleImage = true;
        this.product = new Product();
        this.product.image = new Image();
        this.userService.activeScreen('');
        this.userService.showLoadingState(false);
        this.showAddButton = false;
        this.errorMessage = "";
        this.navigationService.backTo = "homeAdmin";
        this.fileId = "";
        this.hasBeenHit = false;
        this.uploadProgressValue = 10;
        this.networkError = false;
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.isRendering = true;
        }, 50);
    }

    onOK() {
        if (this.networkError == true) {
            this.warningDialog.hide();
            this.routerExtensions.back();
        }
        else {
            this.warningDialog.hide();
        }
    }

    onBack() {
        this.routerExtensions.back();
        localstorage
    }

    onOutsideClick() {
        this.photoUploadDialog.hide();
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
                                that.imageCropper.show(source, { lockSquare: true }).then((args) => {
                                    if (args.image !== null) {
                                        var folder: Folder = Folder.fromPath("/storage/emulated/0" + "/farmersHut");
                                        var file: File = File.fromPath(path.join(folder.path, 'FarmersHut.jpg'));
                                        args.image.saveToFile(file.path, 'jpg');
                                        that.file = "/storage/emulated/0/farmersHut/FarmersHut.jpg";
                                        that.name = that.file.substr(that.file.lastIndexOf("/") + 1);
                                        that.extension = that.name.substr(that.name.lastIndexOf(".") + 1);
                                        that.sliderImage = undefined;
                                        that.sliderImage = fromFile("/storage/emulated/0/farmersHut/FarmersHut.jpg");
                                        that.shouldImageUpdate = "true";
                                        that.isVisibleImage = false;
                                        that.showAddButton = true;
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
                                        that.sliderImage = "";
                                        that.sliderImage = fromFile("/storage/emulated/0/farmersHut/FarmersHut.jpg");
                                        that.shouldImageUpdate = "true";
                                        that.isVisibleImage = false;
                                        that.showAddButton = true;
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

    onAddToSlider() {
        if (!this.hasBeenHit) {
            this.hasBeenHit = true;
            if (this.sliderImage == null) {
                this.warningDialog.show();
                this.errorMessage = "Please select slider image.";
            }
            else {
                if (localstorage.getItem("fileId") != null && localstorage.getItem("fileId") != undefined) {
                    this.fileId = localstorage.getItem("fileId");
                }
                var that = this;
                var mimeType = "image/" + this.extension;
                var uploadSession = session('image-upload');
                if (this.file != null) {
                    this.isLoading = true;
                    var request = {
                        url: Values.BASE_URL + "files",
                        method: "POST",
                        headers: {
                            "Content-Type": "application/octet-stream",
                            "File-Name": "my"
                        },
                        description: "{'uploading':" + "my" + "}"
                    }
                    const params = [
                        { name: "file", filename: that.file, mimeType: mimeType },
                        { name: "shouldImageUpdate", value: that.shouldImageUpdate },
                        { name: "isUpdate", value: "true" },
                        { name: "file_id", value: that.fileId },
                    ]
                    var task = uploadSession.multipartUpload(params, request);
                    task.on("progress", (e) => {
                        this.uploadProgressValue = (e.currentBytes / e.totalBytes) * 100;
                        this.uploadProgressDialog.show();
                    });
                    task.on("responded", (e) => {
                        this.hasBeenHit = false;
                        this.uploadProgressDialog.hide();
                        localstorage.setItem('fromSlider', 'true')
                        this.routerExtensions.back();
                    });
                    task.on("error", (e) => {
                        this.networkError = true;
                        this.errorMessage = "May be your network connection is low.";
                        setTimeout(() => {
                            this.warningDialog.show();
                        }, 10);
                        this.isLoading = false;
                    });
                    task.on("complete", this.completeEvent);
                }
            }
        }
    }

    respondedEvent(e) {
        console.log("RESPONSE: " + e.data);
    }

    errorEvent(e) {
        console.log("Error is: " + JSON.stringify(e));
    }

    completeEvent(e) {
        console.log("Completed :" + JSON.stringify(e));
    }

    compressImage(imageSource: ImageSource): string {
        var compressedImage: string;
        var tempImageBitmap = BitmapFactory.asBitmap(imageSource);

        imageSource = undefined;

        compressedImage = tempImageBitmap.resize({ width: 500, height: 500 }).toBase64(BitmapFactory.OutputFormat.PNG, 50);

        tempImageBitmap = undefined;

        return compressedImage;
    }
}
