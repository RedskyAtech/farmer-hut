import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import * as imagepicker from "nativescript-imagepicker";
import { ModalComponent } from "../../modals/modal.component";
import { ImageCropper } from 'nativescript-imagecropper';
import * as camera from "nativescript-camera";
import * as permissions from "nativescript-permissions";
import { ImageSource, fromFile } from "tns-core-modules/image-source/image-source";
import { Values } from "~/app/values/values";
import { HttpClient } from "@angular/common/http";
import { UserService } from "../../services/user.service";
import { Product } from "../../models/product.model";
import { Image } from "../../models/image.model";
import * as Toast from 'nativescript-toast';
import { NavigationService } from "~/app/services/navigation.service";
import * as BitmapFactory from "nativescript-bitmap-factory"
import { Page } from "tns-core-modules/ui/page/page";
import { Folder, path, File } from "tns-core-modules/file-system";
import { session, Request } from 'nativescript-background-http';
import * as localstorage from "nativescript-localstorage";

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

    constructor(private route: ActivatedRoute, private navigationService: NavigationService, private routerExtensions: RouterExtensions, private http: HttpClient, private userService: UserService, private page: Page) {
        this.page.actionBarHidden = true;
        this.isLoading = false;
        this.isRendering = false;
        this.imageCropper = new ImageCropper();
        this.imageUrl = null;
        this.sliderImage = "";
        this.isVisibleImage = true;
        this.product = new Product();
        this.product.image = new Image();
        this.userService.showLoadingState(false);
        this.showAddButton = false;
        this.errorMessage = "";
        this.navigationService.backTo = "homeAdmin";
        this.fileId = "";
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.isRendering = true;
        }, 50);
    }

    onOK() {
        this.warningDialog.hide();
    }

    onBack() {
        this.routerExtensions.back();
    }

    onOutsideClick() {
        this.photoUploadDialog.hide();
    }

    onUploadImage() {
        this.photoUploadDialog.show();
        // var that = this;
        // let context = imagepicker.create({
        //     mode: "single"
        // });
        // context
        //     .authorize()
        //     .then(() => {
        //         return context.present();
        //     })
        //     .then(selection => {
        //         selection.forEach(function (selected) {
        //             var path = selected.android.toString();
        //             that.sliderImage = path;
        //         });
        //     });
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
                console.log(params);
                console.log(request);
                var task = uploadSession.multipartUpload(params, request);
                task.on("responded", this.respondedEvent);
                task.on("error", this.errorEvent);
                task.on("complete", this.completeEvent);
                setTimeout(() => {
                    // this.userService.showLoadingState(false);
                    this.isLoading = false;
                    this.routerExtensions.navigate(['./homeAdmin'], {
                        clearHistory: true,
                    });
                }, 10000);


                // this.http
                //     .get(Values.BASE_URL + "files")
                //     .subscribe((res: any) => {
                //         if (res != null && res != undefined) {
                //             if (res.isSuccess == true) {
                //                 var id = res.data[0]._id;
                //                 this.http
                //                     .put(Values.BASE_URL + "files/update/" + id, this.product)
                //                     .subscribe((res: any) => {
                //                         if (res != null && res != undefined) {
                //                             if (res.isSuccess == true) {
                //                                 this.userService.showLoadingState(false);
                //                                 this.isLoading = false;
                //                                 Toast.makeText("Image is added successfully!!!", "long").show();
                //                                 this.routerExtensions.navigate(['./homeAdmin'], {
                //                                     clearHistory: true,
                //                                 });
                //                             }
                //                         }
                //                     }, error => {
                //                         this.userService.showLoadingState(false);
                //                         this.isLoading = false;
                //                         alert(error.error.error);
                //                     });
                //             }
                //         }
                //     }, error => {
                //         this.userService.showLoadingState(false);
                //         this.isLoading = false;
                //         console.log(error.error.error);
                //     });
            }
        }
    }

    respondedEvent(e) {
        // var that = this;
        console.log("RESPONSE: " + e.data);
        // this.userService.showLoadingState(false);
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
