import { Component, OnInit, ViewChild } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { ActivatedRoute } from "@angular/router";
import { ImageSource, fromFile } from "tns-core-modules/image-source/image-source";
import { ImageCropper } from 'nativescript-imagecropper';
import { Category } from "~/app/models/category.model";
import { Values } from "~/app/values/values";
import { HttpClient } from "@angular/common/http";
import { Image } from "~/app/models/image.model";
import { ModalComponent } from "../../../app/modals/modal.component";
import { session } from 'nativescript-background-http';
import { Folder, path, File } from "tns-core-modules/file-system";
import { NavigationService } from "~/app/services/navigation.service";
import { Page } from "tns-core-modules/ui/page/page";

import * as camera from "nativescript-camera";
import * as permissions from "nativescript-permissions";
import * as imagepicker from "nativescript-imagepicker";
import { UserService } from "~/app/services/user.service";

declare var android: any;

@Component({
    selector: "ns-addCategory",
    moduleId: module.id,
    templateUrl: "./add-category.component.html",
    styleUrls: ["./add-category.component.css"]
})

export class AddCategoryComponent implements OnInit {

    @ViewChild('photoUploadDialog') photoUploadDialog: ModalComponent;
    @ViewChild('warningDialog') warningDialog: ModalComponent;
    @ViewChild('uploadProgressDialog') uploadProgressDialog: ModalComponent;

    categoryImage: string | ImageSource = "res://add_image_icon";
    categoryBorderColor: string;
    categoryHint = "Category name";
    categoryName = "";
    imageUrl: any;
    private imageCropper: ImageCropper;
    category: Category;
    categoryId: string;
    type: string;
    showAddButton: boolean;
    errorMessage: string;
    file: any;
    url: string;
    name: string;
    extension: string;
    shouldImageUpdate: string;
    isRendering: boolean;
    isLoading: boolean;
    isVisibleImage: boolean;
    uploadProgressValue: number;
    networkError: boolean;

    constructor(private route: ActivatedRoute, private navigationService: NavigationService, private userService: UserService, private routerExtensions: RouterExtensions, private http: HttpClient, private page: Page) {
        this.page.actionBarHidden = true;
        this.isLoading = false;
        this.isRendering = false;
        this.categoryBorderColor = "white"
        this.imageCropper = new ImageCropper();
        this.imageUrl = null;
        this.category = new Category();
        this.category.image = new Image();
        this.showAddButton = true;
        this.errorMessage = "";
        this.extension = 'jpg';
        this.shouldImageUpdate = "true";
        this.navigationService.backTo = "homeAdmin";
        this.isVisibleImage = true;
        this.userService.activeScreen('');
        this.uploadProgressValue = 10;
        this.networkError = false;

        this.route.queryParams.subscribe(params => {
            if (params["categoryId"] != undefined) {
                this.categoryId = params["categoryId"];
            }
            if (params["type"] != undefined) {
                this.type = params["type"];
            }
        });

        if (this.categoryId != undefined) {
            this.http
                .get(Values.BASE_URL + "categories/" + this.categoryId)
                .subscribe((res: any) => {
                    if (res != null && res != undefined) {
                        if (res.isSuccess == true) {
                            this.categoryImage = res.data.image.resize_url;
                            this.categoryName = res.data.name;
                            this.categoryBorderColor = "#00C012";
                            this.isVisibleImage = false;
                        }
                    }
                }, error => {
                    this.isVisibleImage = false;
                    this.errorMessage = "May be your network connection is low.";
                    this.warningDialog.show();
                });
        }
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
    }


    onCategoryTextChanged(args) {
        this.categoryBorderColor = "#00C012";
        this.categoryName = args.object.text;
        if (this.imageUrl != null) {
            this.showAddButton = true;
        }
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
        context
            .authorize()
            .then(() => {
                return context.present();
            })
            .then(selection => {
                selection.forEach(function (selected) {
                    that.showAddButton = true;
                    var image = new ImageSource();
                    image.fromAsset(selected).then((source) => {
                        that.imageCropper.show(source, { lockSquare: true }).then((args: any) => {
                            if (args.image !== null) {
                                var folder: Folder = Folder.fromPath("/storage/emulated/0" + "/farmersHut");
                                var file: File = File.fromPath(path.join(folder.path, 'FarmersHut.jpg'));
                                args.image.saveToFile(file.path, 'jpg');
                                that.file = "/storage/emulated/0/farmersHut/FarmersHut.jpg";
                                that.name = that.file.substr(that.file.lastIndexOf("/") + 1);
                                that.extension = that.name.substr(that.name.lastIndexOf(".") + 1);
                                that.categoryImage = undefined;
                                that.categoryImage = fromFile("/storage/emulated/0/farmersHut/FarmersHut.jpg");
                                that.shouldImageUpdate = "true";
                                that.isVisibleImage = false;
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
                        .then((selected) => {
                            let source = new ImageSource();
                            source.fromAsset(selected).then((source) => {
                                this.imageCropper.show(source, { lockSquare: true }).then((args) => {
                                    if (args.image !== null) {
                                        var folder: Folder = Folder.fromPath("/storage/emulated/0" + "/farmersHut");
                                        var file: File = File.fromPath(path.join(folder.path, 'FarmersHut.jpg'));
                                        args.image.saveToFile(file.path, 'jpg');
                                        that.file = "/storage/emulated/0/farmersHut/FarmersHut.jpg";
                                        that.name = that.file.substr(that.file.lastIndexOf("/") + 1);
                                        that.extension = that.name.substr(that.name.lastIndexOf(".") + 1);
                                        that.categoryImage = undefined;
                                        that.categoryImage = fromFile("/storage/emulated/0/farmersHut/FarmersHut.jpg");
                                        that.shouldImageUpdate = "true";
                                        that.isVisibleImage = false;
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

    onAddCategory() {
        if (this.categoryImage == null) {
            this.errorMessage = "Please select category image.";
            this.warningDialog.show();
        }
        else if (this.categoryName == "") {
            this.errorMessage = "Please enter category name.";
            this.warningDialog.show();
        }
        else {
            var name = encodeURIComponent(this.categoryName);
            this.isLoading = true;
            var that = this;
            var mimeType = "image/" + that.extension;
            var uploadSession = session('image-upload');
            if (that.type == "edit") {
                if (that.file == null) {
                    that.file = "/storage/emulated/0/farmersHut/FarmersHut.jpg";
                    that.shouldImageUpdate = "false";
                }
                var request = {
                    url: Values.BASE_URL + "categories",
                    method: "POST",
                    headers: {
                        "Content-Type": "application/octet-stream",
                        "File-Name": "my file"
                    },
                    description: "{'uploading':" + "my file" + "}"
                }
                const params = [
                    { name: "file", filename: that.file, mimeType: mimeType },
                    { name: "name", value: name },
                    { name: "isUpdate", value: "true" },
                    { name: "category_id", value: that.categoryId },
                    { name: "shouldImageUpdate", value: that.shouldImageUpdate }
                ]
                var task = uploadSession.multipartUpload(params, request);
                task.on("progress", (e) => {
                    this.uploadProgressValue = (e.currentBytes / e.totalBytes) * 100;
                    this.uploadProgressDialog.show();
                });
                task.on("responded", (e: any) => {
                    if (e.responseCode == "201") {
                        this.errorMessage = "Category is already exist.";
                        setTimeout(() => {
                            this.warningDialog.show();
                        }, 10);
                    }
                    else {
                        localStorage.setItem('fromCategory', 'true');
                        this.routerExtensions.back();
                    }
                    this.isLoading = false;
                    this.uploadProgressDialog.hide();
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
            else {
                var request = {
                    url: Values.BASE_URL + "categories",
                    method: "POST",
                    headers: {
                        "Content-Type": "application/octet-stream",
                        "File-Name": that.name
                    },
                    description: "{'uploading':" + that.name + "}"
                }
                const params = [
                    { name: "file", filename: that.file, mimeType: mimeType },
                    { name: "name", value: name },
                ]
                var task = uploadSession.multipartUpload(params, request);
                task.on("progress", (e) => {
                    this.uploadProgressValue = (e.currentBytes / e.totalBytes) * 100;
                    this.uploadProgressDialog.show();
                });
                task.on("responded", (e: any) => {
                    if (e.responseCode == "201") {
                        this.errorMessage = "Category is already exist.";
                        setTimeout(() => {
                            this.warningDialog.show();
                        }, 10);
                    }
                    else {
                        localStorage.setItem('fromCategory', 'true')
                        this.routerExtensions.back();
                    }
                    this.uploadProgressDialog.hide();
                    this.isLoading = false;
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

    respondedEvent(e) {
        console.log("RESPONSE: " + e.data);
        localStorage.setItem('fromCategory', 'true')
        this.routerExtensions.back();
        this.isLoading = false;
    }

    errorEvent(e) {
        console.log("Error is: " + JSON.stringify(e));
    }

    completeEvent(e) {
        console.log("Completed :" + JSON.stringify(e));
        this.isLoading = false;
    }

    onOutsideClick() {
        this.photoUploadDialog.hide();
    }
}
