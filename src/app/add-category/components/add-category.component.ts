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

@Component({
    selector: "ns-addCategory",
    moduleId: module.id,
    templateUrl: "./add-category.component.html",
    styleUrls: ["./add-category.component.css"]
})

export class AddCategoryComponent implements OnInit {

    @ViewChild('photoUploadDialog') photoUploadDialog: ModalComponent;

    categoryImage: string = "res://image_icon";
    categoryBorderColor: string;
    categoryHint = "Category name";
    categoryName = "";
    imageUrl: any;
    private imageCropper: ImageCropper;
    category: Category;
    categoryId: string;
    type: string;

    constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private userService: UserService) {
        this.categoryBorderColor = "white"
        this.imageCropper = new ImageCropper();
        this.imageUrl = null;
        this.category = new Category();
        this.category.image = new Image();

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
                            this.categoryBorderColor = "#E98A02";
                        }
                    }
                }, error => {
                    alert(error.error.error);
                });
        }
    }

    ngOnInit(): void {
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
        this.categoryBorderColor = "#E98A02";
        this.categoryName = args.object.text;
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
                                that.categoryImage = that.imageUrl;
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
                                        that.categoryImage = that.imageUrl;
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
        if (this.categoryName == "") {
            alert("Please enter category name!!!")
        }
        else if (this.imageUrl == "") {
            alert("Please select category image!!!");
        }
        else {
            this.category.name = this.categoryName;
            this.category.image.url = this.imageUrl;
            this.userService.showLoadingState(true);

            if (this.type == "edit") {
                this.http
                    .put(Values.BASE_URL + "categories/update/" + this.categoryId, this.category)
                    .subscribe((res: any) => {
                        if (res != null && res != undefined) {
                            if (res.isSuccess == true) {
                                this.userService.showLoadingState(false);
                                let navigationExtras: NavigationExtras = {
                                    queryParams: {
                                        "index": "1"
                                    },
                                };
                                this.router.navigate(['./homeAdmin'], navigationExtras);
                            }
                        }
                    }, error => {
                        this.userService.showLoadingState(false);
                        alert(error.error.error);
                    });
            }
            else {
                this.http
                    .post(Values.BASE_URL + "categories/", this.category)
                    .subscribe((res: any) => {
                        if (res != null && res != undefined) {
                            if (res.isSuccess == true) {
                                this.userService.showLoadingState(false);
                                let navigationExtras: NavigationExtras = {
                                    queryParams: {
                                        "index": "1"
                                    },
                                };
                                this.router.navigate(['./homeAdmin'], navigationExtras);
                            }
                        }
                    }, error => {
                        this.userService.showLoadingState(false);
                        alert(error.error.error);
                    });
            }
        }
    }

    onOutsideClick() {
        this.photoUploadDialog.hide();
    }
}
