import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import * as imagepicker from "nativescript-imagepicker";
import { ImageSource } from "tns-core-modules/image-source/image-source";
import { ImageCropper } from 'nativescript-imagecropper';
import * as camera from "nativescript-camera";
import * as permissions from "nativescript-permissions";
import { Category } from "~/app/models/category.model";
import { Values } from "~/app/values/values";
import { HttpClient } from "@angular/common/http";
import { Image } from "~/app/models/image.model";
import { ModalComponent } from "../../../app/modals/modal.component";
import { UserService } from "../../../app/services/user.service";
import { registerElement } from "nativescript-angular/element-registry";
import { session, Request } from 'nativescript-background-http';
import { Folder, path, knownFolders, File } from "tns-core-modules/file-system";

@Component({
    selector: "ns-addCategory",
    moduleId: module.id,
    templateUrl: "./add-category.component.html",
    styleUrls: ["./add-category.component.css"]
})

export class AddCategoryComponent implements OnInit {

    @ViewChild('photoUploadDialog') photoUploadDialog: ModalComponent;
    @ViewChild('warningDialog') warningDialog: ModalComponent;

    categoryImage: string = "res://add_image_icon";
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

    constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private userService: UserService) {
        this.categoryBorderColor = "white"
        this.imageCropper = new ImageCropper();
        this.imageUrl = null;
        this.category = new Category();
        this.category.image = new Image();
        this.showAddButton = true;
        this.errorMessage = "";
        this.userService.showLoadingState(false);
        this.extension = 'jpg';

        this.route.queryParams.subscribe(params => {
            if (params["categoryId"] != undefined) {
                this.categoryId = params["categoryId"];
            }
            if (params["type"] != undefined) {
                this.type = params["type"];
            }
        });

        if (this.categoryId != undefined) {
            this.userService.showLoadingState(true);
            this.http
                .get(Values.BASE_URL + "categories/" + this.categoryId)
                .subscribe((res: any) => {
                    if (res != null && res != undefined) {
                        if (res.isSuccess == true) {
                            this.userService.showLoadingState(false);
                            this.categoryImage = res.data.image.url;
                            this.categoryName = res.data.name
                            this.categoryBorderColor = "#00C012";
                        }
                    }
                }, error => {
                    alert(error.error.error);
                });
        }
    }

    ngOnInit(): void {
    }

    onOK() {
        this.warningDialog.hide();
    }

    onBack() {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                "index": "1"
            },
        };
        this.router.navigate(['/homeAdmin'], navigationExtras);
    }

    onCategoryTextChanged(args) {
        this.categoryBorderColor = "#00C012";
        this.categoryName = args.object.text;
        if (this.imageUrl != null) {
            this.showAddButton = true;
        }
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
                                that.categoryImage = "/storage/emulated/0/farmersHut/FarmersHut.jpg";
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
                                        that.categoryImage = "/storage/emulated/0/farmersHut/FarmersHut.jpg";
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
        if (this.file == null) {
            this.errorMessage = "Please select category image.";
            this.warningDialog.show();
            // alert("Please select category image!!!");
        }
        else if (this.categoryName == "") {
            this.errorMessage = "Please enter category name.";
            this.warningDialog.show();
            // alert("Please enter category name!!!")
        }
        else {
            // this.category.name = this.categoryName;
            // this.category.image.url = this.imageUrl;
            this.userService.showLoadingState(true);
            var that = this;
            var mimeType = "image/" + this.extension;
            var uploadSession = session('image-upload');
            if (this.type == "edit") {
                var request = {
                    url: Values.BASE_URL + "categories/update/",
                    method: "POST",
                    headers: {
                        "Content-Type": "application/octet-stream",
                        "File-Name": that.name
                    },
                    description: "{'uploading':" + that.name + "}"
                }
                const params = [
                    { name: "file", filename: that.file, mimeType: mimeType },
                    { name: "name", value: that.categoryName },
                ]
                console.log(params);
                console.log(request);
                var task = uploadSession.multipartUpload(params, request);
                that.userService.showLoadingState(false);
                task.on("Responded", this.respondedEvent);
                task.on("Error", this.errorEvent);
                task.on("Complete", this.completeEvent);
                // this.http
                //     .put(Values.BASE_URL + "categories/update/" + this.categoryId, this.category)
                //     .subscribe((res: any) => {
                //         if (res != null && res != undefined) {
                //             if (res.isSuccess == true) {
                //                 this.userService.showLoadingState(false);
                //                 let navigationExtras: NavigationExtras = {
                //                     queryParams: {
                //                         "index": "1"
                //                     },
                //                 };
                //                 this.router.navigate(['./homeAdmin'], navigationExtras);
                //             }
                //         }
                //     }, error => {
                //         this.userService.showLoadingState(false);
                //         alert(error.error.error);
                //     });
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
                    { name: "name", value: that.categoryName },
                ]
                console.log(params);
                console.log(request);
                var task = uploadSession.multipartUpload(params, request);
                that.userService.showLoadingState(false);
                task.on("Responded", this.respondedEvent);
                task.on("Error", this.errorEvent);
                task.on("Complete", this.completeEvent);

                // this.http
                //     .post(Values.BASE_URL + "categories/", this.category)
                //     .subscribe((res: any) => {
                //         if (res != null && res != undefined) {
                //             if (res.isSuccess == true) {
                //                 this.userService.showLoadingState(false);
                //                 let navigationExtras: NavigationExtras = {
                //                     queryParams: {
                //                         "index": "1"
                //                     },
                //                 };
                //                 this.router.navigate(['./homeAdmin'], navigationExtras);
                //             }
                //         }
                //     }, error => {
                //         this.userService.showLoadingState(false);
                //         alert(error.error.error);
                //     });
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
        var that = this;
        console.log("Completed :" + JSON.stringify(e));
    }

    onOutsideClick() {
        this.photoUploadDialog.hide();
    }
}
