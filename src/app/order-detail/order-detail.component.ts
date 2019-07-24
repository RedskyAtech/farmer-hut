import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { SelectedIndexChangedEventData } from "tns-core-modules/ui/tab-view";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import { ModalComponent } from "~/app/modals/modal.component";
import * as Toast from 'nativescript-toast';

@Component({
    selector: "ns-orderDetail",
    moduleId: module.id,
    templateUrl: "./order-detail.component.html",
    styleUrls: ["./order-detail.component.css"]
})
export class OrderDetailComponent implements OnInit, AfterViewInit {

    @ViewChild('confirmOrderDialog') confirmOrderDialog: ModalComponent;

    orderedProducts = [];
    userName: string;
    phoneNumber: string;
    address: string;
    totalAmount: string;

    constructor(private route: ActivatedRoute, private router: Router) {
        this.userName = "Sumit Kumar Sangwal";
        this.phoneNumber = "1234567890";
        this.address = "House No. 121, 3rd crossing, Street no. 6, old suraj nagari";
        this.totalAmount = "7800";
    }

    ngOnInit(): void {
        this.orderedProducts.push({ id: 0, image: "res://item_1", fullName: "Bee Fruity Red Gum Honey", quantity: "1", totalPrice: "100", weight: "100 gm", price: "RS 100" });
        this.orderedProducts.push({ id: 1, image: "res://item_2", fullName: "Bee Fruity Red Gum Honey", quantity: "2", totalPrice: "300", weight: "200 gm", price: "RS 150" });
        this.orderedProducts.push({ id: 2, image: "res://item_3", fullName: "Bee Fruity Red Gum Honey", quantity: "3", totalPrice: "1050", weight: "400 gm", price: "RS 350" });
        this.orderedProducts.push({ id: 3, image: "res://item_4", fullName: "Bee Fruity Red Gum Honey", quantity: "4", totalPrice: "1800", weight: "500 gm", price: "RS 450" });
        this.orderedProducts.push({ id: 4, image: "res://item_5", fullName: "Bee Fruity Red Gum Honey", quantity: "3", totalPrice: "2550", weight: "1 kg", price: "RS 850" });
        this.orderedProducts.push({ id: 5, image: "res://item_1", fullName: "Bee Fruity Red Gum Honey", quantity: "7", totalPrice: "700", weight: "100 gm", price: "RS 100" });
        this.orderedProducts.push({ id: 6, image: "res://item_2", fullName: "Bee Fruity Red Gum Honey", quantity: "1", totalPrice: "150", weight: "200 gm", price: "RS 150" });
        this.orderedProducts.push({ id: 7, image: "res://item_3", fullName: "Bee Fruity Red Gum Honey", quantity: "2", totalPrice: "700", weight: "400 gm", price: "RS 350" });
        this.orderedProducts.push({ id: 8, image: "res://item_4", fullName: "Bee Fruity Red Gum Honey", quantity: "1", totalPrice: "450", weight: "500 gm", price: "RS 450" });
    }

    ngAfterViewInit(): void {

    }

    onBack() {
        this.router.navigate(['/viewOrders']);
    }

    onConfirmOrder() {
        this.confirmOrderDialog.show();
    }

    onConfirm() {
        this.confirmOrderDialog.hide();
        this.router.navigate(['./viewOrders']);
        Toast.makeText("Order successfully confirmed!!!", "long").show();
    }

    onCancel() {
        this.confirmOrderDialog.hide();
    }

    onTrack() {
        alert("track clicked");
    }
}
