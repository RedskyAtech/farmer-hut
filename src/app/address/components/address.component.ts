import { Component, OnInit, ViewChild } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { Values } from "~/app/values/values";
import { User } from "~/app/models/user.model";
import { Location } from "~/app/models/location.model";
import { Address } from "../../models/address.model";
import { UserService } from "../../services/user.service";
import { DeliveryAddress } from "../../models/delivery-address.model";
import { ModalComponent } from "~/app/modals/modal.component";
import { NavigationService } from "~/app/services/navigation.service";
import { Page } from "tns-core-modules/ui/page/page";
import { MapView, Marker, Position } from "nativescript-google-maps-sdk";

import * as geolocation from "nativescript-geolocation";
import * as Toast from 'nativescript-toast';
import * as localstorage from "nativescript-localstorage";
import * as location from "nativescript-geolocation"

@Component({
    selector: "ns-address",
    moduleId: module.id,
    templateUrl: "./address.component.html",
    styleUrls: ["./address.component.css"]
})
export class AddressComponent implements OnInit {
    @ViewChild('warningDialog') warningDialog: ModalComponent;

    addressBorderColor;
    cityBorderColor = "#00C012";
    districtBorderColor = "#00C012";
    stateBorderColor = "#00C012";
    addressHint = "Address (House/Street/Town)";
    mapAddressHint = "Map Address";
    address: string;
    mapAddress: string;
    mapAddressColor: string;
    city = "";
    district = "";
    latitude: any;
    longitude: any;
    user: User;
    userId: string;
    from: string;
    adminId: string;
    errorMessage: string;


    intialLatitude = 30.140726;
    intialLongitude = 74.200587;
    zoom = 17;
    minZoom = 0;
    maxZoom = 22;
    bearing = 0;
    tilt = 0;
    padding = [40, 40, 40, 40];
    pinLocation = false;

    mapView: MapView;
    marker = new Marker();
    location: location.Location;
    finalLatitude: number;
    finalLongitude: number;

    isLoading: boolean;
    mapLabelClass: boolean;
    listener: any;
    mapCount: number;
    isVisibleMapIcon: boolean;

    constructor(private http: HttpClient, private navigationService: NavigationService, private route: ActivatedRoute, private routerExtensions: RouterExtensions, private userService: UserService, private page: Page) {
        this.page.actionBarHidden = true;
        this.isLoading = false;
        this.user = new User();
        this.user.address = new Address();
        this.user.address.location = new Location();
        this.user.deliveryAddress = new DeliveryAddress();
        this.user.deliveryAddress.location = new Location();
        this.userService.activeScreen('');
        this.address = "";
        this.mapAddress = "Select address from map";
        this.mapAddressColor = "#FFFFFF";
        this.mapLabelClass = true;
        this.mapCount = 1;
        this.isVisibleMapIcon = false;
        this.addressBorderColor = "white";

        this.city = "Abohar";
        this.district = "Fazilka";
        this.errorMessage = "";

        this.route.queryParams.subscribe(params => {
            if (params["from"] != "") {
                this.from = params["from"];
            }
        });

        if (this.from == "cart") {
            this.navigationService.backTo = "cart";
        }
        else {
            this.navigationService.backTo = "profile";
        }

        if (localstorage.getItem("userToken") != null && localstorage.getItem("userToken") && localstorage.getItem("userId") != null && localstorage.getItem("userId") != undefined) {
            this.userId = localstorage.getItem("userId");
        }
        if (localstorage.getItem("adminToken") != null && localstorage.getItem("adminToken") && localstorage.getItem("adminId") != null && localstorage.getItem("adminId") != undefined) {
            this.adminId = localstorage.getItem("adminId");
        }
    }

    ngOnInit(): void {
    }

    onOK() {
        this.warningDialog.hide();
    }

    onAddressTextChanged(args) {
        this.addressBorderColor = "#00C012";
        this.address = args.object.text;
    }

    onMapReady(event) {
        console.log('Map Ready');

        this.mapView = event.object;

        console.log("Setting a marker...");

        setTimeout(async () => {
            await location.getCurrentLocation({ desiredAccuracy: 0, timeout: 120000, maximumAge: 120000 }).then((location: location.Location) => {
                this.marker.position = Position.positionFromLatLng(location.latitude, location.longitude)
                this.intialLatitude = location.latitude;
                this.intialLongitude = location.longitude;
                this.marker.draggable = true;
                this.marker.color = "#00C012";
                this.marker.visible = true;
                this.mapView.myLocationEnabled = true;
                this.mapView.addMarker(this.marker);
                console.log('LOC:', location)
            }).catch((error) => {
                console.log('Error:', error)
            })
        }, 1)
    }

    onCoordinateTapped(args) {
        console.log("Coordinate Tapped, Lat: " + args.position.latitude + ", Lon: " + args.position.longitude, args);
    }

    onMarkerEvent(args) {
        console.log("Marker Event: '" + args.eventName
            + "' triggered on: " + args.marker.title
            + ", Lat: " + args.marker.position.latitude + ", Lon: " + args.marker.position.longitude, args);
    }

    onCameraChanged(args) {
        console.log("Camera changed: " + JSON.stringify(args.camera));
        this.finalLatitude = args.camera.latitude;
        this.finalLongitude = args.camera.longitude;
    }

    onCameraMove(args) {
        this.marker.position = Position.positionFromLatLng(args.camera.latitude, args.camera.longitude)
        console.log("Camera moving: " + JSON.stringify(args.camera));
    }

    addAddress(id: string) {
        if (this.from == "cart") {
            localstorage.setItem("address", this.address);
            localstorage.setItem("mapAddress", this.mapAddress);
            this.user.deliveryAddress.line1 = this.address;
            this.user.deliveryAddress.line2 = this.mapAddress;
            this.user.deliveryAddress.location.latitude = this.finalLatitude.toString();
            this.user.deliveryAddress.location.longitude = this.finalLongitude.toString();
            this.http
                .put(Values.BASE_URL + "users/update/" + id, this.user)
                .subscribe((res: any) => {
                    if (res != "" && res != undefined) {
                        if (res.isSuccess == true) {
                            this.userService.showLoadingState(false);
                            Toast.makeText("Delivery address added successfully!!!", "long").show();
                            this.routerExtensions.back();
                        }
                    }
                }, error => {
                    this.userService.showLoadingState(false);
                    if (error.error.error == undefined) {
                        this.errorMessage = "May be your network connection is low.";
                        this.warningDialog.show();
                    }
                    else {
                        this.errorMessage = error.error.error;
                        this.warningDialog.show();
                    }
                });
        } else {
            this.user.address.line1 = this.address;
            this.user.address.line2 = this.mapAddress;
            this.user.address.location.latitude = this.latitude;
            this.user.address.location.longitude = this.longitude;
            this.http
                .put(Values.BASE_URL + "users/update/" + id, this.user)
                .subscribe((res: any) => {
                    if (res != "" && res != undefined) {
                        if (res.isSuccess == true) {
                            this.userService.showLoadingState(false);
                            Toast.makeText("Address added successfully!!!", "long").show();
                            this.routerExtensions.back();
                        }
                    }
                }, error => {
                    this.userService.showLoadingState(false);
                    if (error.error.error == undefined) {
                        this.errorMessage = "May be your network connection is low.";
                        this.warningDialog.show();
                    }
                    else {
                        this.errorMessage = error.error.error;
                        this.warningDialog.show();
                    }
                });
        }
    }

    onAddAddress() {
        if (this.address == "") {
            this.errorMessage = "Please enter address.";
            this.warningDialog.show();
        }
        else if (this.mapAddress == "") {
            this.errorMessage = "Please select map address.";
            this.warningDialog.show();
        }
        else {
            this.userService.showLoadingState(true);
            if (localstorage.getItem("userType") == "admin") {
                this.addAddress(this.adminId);
            }
            else {
                this.addAddress(this.userId);
            }
        }
    }

    onBack() {
        this.routerExtensions.back();
    }

    onMap() {
        this.pinLocation = true;
        this.mapAddress = "";
        geolocation.enableLocationRequest();
    }

    onSelectLocation() {
        this.mapCount++;
        if (this.mapCount >= 2) {
            this.isVisibleMapIcon = true;
        }
        else {
            this.isVisibleMapIcon = false;
        }

        this.mapView.removeAllMarkers();

        this.pinLocation = false;
        this.isLoading = true;
        console.log("latiiiiiiiiLongiiiiiiii:::::::", this.finalLatitude, this.finalLongitude);
        this.http
            // .get(Values.GOOGLE_MAP_URL + "latlng=" + this.finalLatitude + "," + this.finalLongitude + "&key=AIzaSyA3-BQmJVYB6_soLJPv7cx2lFUMAuELlkM")
            .get(Values.GOOGLE_MAP_URL + "latlng=" + this.finalLatitude + "," + this.finalLongitude + "&key=AIzaSyBJJyDTNfWFxA-KvQD52vUE_2LB45BJtwA")
            .subscribe((res: any) => {
                console.log("GeoCode RES::::::::::", res);
                this.mapLabelClass = false;
                this.mapAddress = res.results[0].formatted_address;
                this.mapAddressColor = "#00C012";
                this.isLoading = false;

            }, error => {
                this.mapLabelClass = false;

                Toast.makeText('Could not get Address', 'long')
                console.log(error);
                this.isLoading = false;
            });
    }

}
