import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import * as imagepicker from "nativescript-imagepicker";
import { ModalComponent } from "../modals/modal.component";
import { ImageCropper } from 'nativescript-imagecropper';
import * as camera from "nativescript-camera";
import * as permissions from "nativescript-permissions";
import { ImageSource } from "tns-core-modules/image-source/image-source";
import { Values } from "~/app/values/values";
import { HttpClient } from "@angular/common/http";
import { UserService } from "../services/user.service";
import { Product } from "../models/product.model";
import { Image } from "../models/image.model";
import * as Toast from 'nativescript-toast';

@Component({
    selector: "ns-addSlider",
    moduleId: module.id,
    templateUrl: "./add-slider.component.html",
    styleUrls: ["./add-slider.component.css"]
})

export class AddSliderComponent implements OnInit {

    @ViewChild('photoUploadDialog') photoUploadDialog: ModalComponent;

    sliderImage: string;
    private imageCropper: ImageCropper;
    imageUrl: any;
    product: Product;

    constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private userService: UserService) {
        this.imageCropper = new ImageCropper();
        this.imageUrl = null;
        this.sliderImage = "res://image_icon";
        this.product = new Product();
        this.product.image = new Image();
        this.userService.showLoadingState(false);
    }

    ngOnInit(): void {
    }

    onBack() {
        this.router.navigate(['/homeAdmin']);
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
                                that.sliderImage = that.imageUrl;
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
                                        that.sliderImage = that.imageUrl;
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
        this.product.image.url = this.imageUrl;
        if (this.product.image.url != null) {
            this.userService.showLoadingState(true);
            this.http
                .get(Values.BASE_URL + "files")
                .subscribe((res: any) => {
                    if (res != null && res != undefined) {
                        if (res.isSuccess == true) {
                            var id = res.data[0]._id;
                            this.http
                                .put(Values.BASE_URL + "files/update/" + id, this.product)
                                .subscribe((res: any) => {
                                    if (res != null && res != undefined) {
                                        if (res.isSuccess == true) {
                                            this.userService.showLoadingState(false);
                                            Toast.makeText("Image is added successfully!!!", "long").show();
                                            this.router.navigate(['./homeAdmin']);
                                        }
                                    }
                                }, error => {
                                    this.userService.showLoadingState(false);
                                    alert(error.error.error);
                                });
                        }
                    }
                }, error => {
                    this.userService.showLoadingState(false);
                    console.log(error.error.error);
                });
        }
    }
}