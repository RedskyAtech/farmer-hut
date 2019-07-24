import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import * as imagepicker from "nativescript-imagepicker";

@Component({
    selector: "ns-addCategory",
    moduleId: module.id,
    templateUrl: "./add-category.component.html",
    styleUrls: ["./add-category.component.css"]
})

export class AddCategoryComponent implements OnInit {

    categoryImage: string = "res://image_icon";
    categoryBorderColor: string;
    categoryHint = "Category name";
    categoryName = "";

    constructor(private route: ActivatedRoute, private router: Router) {
        this.categoryBorderColor = "white"
        this.route.queryParams.subscribe(params => {
            if (params["categoryImage"] != undefined) {
                this.categoryImage = params["categoryImage"];
            }
            if (params["categoryName"] != undefined) {
                this.categoryName = params["categoryName"];
                this.categoryBorderColor = "#E98A02";
            }
        });
    }

    ngOnInit(): void {
    }

    onBack() {
        this.router.navigate(['/homeAdmin']);
    }

    onCategoryTextChanged(args) {
        this.categoryBorderColor = "#E98A02";
        this.categoryName = args.object.text;
    }

    onUploadImage() {
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
                    var path = selected.android.toString();
                    that.categoryImage = path;
                });
            });
    }

    onAddCategory() {
        if (this.categoryName == "") {
            alert("Please enter category name!!!")
        }
        else if (!(this.categoryName.match("^[a-zA-Z ]*$"))) {
            alert("Category name contains characters only!!!");
        }
        else {
            this.router.navigate(['./homeAdmin']);
        }
    }
}
