import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { Directions } from "nativescript-directions";
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
import * as application from "tns-core-modules/application";

@Component({
    selector: "ns-address",
    moduleId: module.id,
    templateUrl: "./address.component.html",
    styleUrls: ["./address.component.css"]
})
export class AddressComponent implements OnInit {
    @ViewChild('warningDialog') warningDialog: ModalComponent;

    addressBorderColor;
    // mapAddressBorderColor;
    cityBorderColor = "#00C012";
    districtBorderColor = "#00C012";
    stateBorderColor = "#00C012";
    // pincodeBorderColor = "white";
    addressHint = "Address (House/Street/Town)";
    mapAddressHint = "Map Address";
    // cityHint = "City";
    // districtHint = "District";
    // stateHint = "State";
    // pincodeHint = "Pincode"
    address: string;
    mapAddress: string;
    city = "";
    district = "";
    // pincode = "";
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

    constructor(private http: HttpClient, private navigationService: NavigationService, private route: ActivatedRoute, private routerExtensions: RouterExtensions, private userService: UserService, private page: Page, private changeDetector: ChangeDetectorRef) {
        this.page.actionBarHidden = true;
        this.isLoading = false;
        this.user = new User();
        this.user.address = new Address();
        this.user.address.location = new Location();
        this.user.deliveryAddress = new DeliveryAddress();
        this.user.deliveryAddress.location = new Location();
        this.address = "";
        this.mapAddress = "";
        this.mapLabelClass = true;
        // this.route.queryParams.subscribe(params => {
        //     this.city = params["city"];
        //     this.district = params["district"];
        //     this.state = params["state"];
        // });
        this.addressBorderColor = "white";
        // this.mapAddressBorderColor = "white";

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
        // this.listener = application.android.on(application.AndroidApplication.activityBackPressedEvent, (args: any) => {
        //     this.routerExtensions.back();
        //     args.cancel = true;
        // });
        // application.android.off(this.listener);
    }

    onOK() {
        this.warningDialog.hide();
    }

    onAddressTextChanged(args) {
        this.addressBorderColor = "#00C012";
        this.address = args.object.text;
        // this.changeDetector.detectChanges();
    }
    onMapAddressTextChanged(args) {
        // this.mapAddressBorderColor = "#00C012";
        this.mapAddress = args.object.text;
        // this.changeDetector.detectChanges();
    }




    //Map events
    onMapReady(event) {
        console.log('Map Ready');

        this.mapView = event.object;

        console.log("Setting a marker...");

        // this.marker.position = Position.positionFromLatLng(this.latitude, this.longitude)

        // this.marker.icon = this.image;
        setTimeout(async () => {
            await location.getCurrentLocation({ desiredAccuracy: 0, timeout: 120000, maximumAge: 120000 }).then((location: location.Location) => {
                // this.location = location;
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






    // onCityTextChanged(args) {
    //     this.addressBorderColor = "white";
    //     this.cityBorderColor = "#00C012";
    //     this.districtBorderColor = "white";
    //     this.stateBorderColor = "white";
    //     this.pincodeBorderColor = "white";
    //     this.city = args.object.text.toLowerCase();
    // }
    // onDistrictTextChanged(args) {
    //     this.addressBorderColor = "white";
    //     this.cityBorderColor = "white";
    //     this.districtBorderColor = "#00C012";
    //     this.stateBorderColor = "white";
    //     this.pincodeBorderColor = "white";
    //     this.district = args.object.text.toLowerCase();
    // }
    // onStateTextChanged(args) {
    //     this.addressBorderColor = "white";
    //     this.cityBorderColor = "white";
    //     this.districtBorderColor = "white";
    //     this.stateBorderColor = "#00C012";
    //     this.pincodeBorderColor = "white";
    //     this.state = args.object.text.toLowerCase();
    // }
    // onPincodeTextChanged(args) {
    //     this.addressBorderColor = "white";
    //     this.cityBorderColor = "white";
    //     this.districtBorderColor = "white";
    //     this.stateBorderColor = "white";
    //     this.pincodeBorderColor = "#00C012";
    //     this.pincode = args.object.text.toLowerCase();
    // }

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
                            // this.routerExtensions.navigate(['./cart'], {
                            //     clearHistory: true,
                            // });

                            this.routerExtensions.back();
                        }
                    }
                }, error => {
                    this.userService.showLoadingState(false);
                    if (error.error.error == undefined) {
                        this.errorMessage = "May be your network connection is low.";
                        this.warningDialog.show();
                        // alert("Something went wrong!!! May be your network connection is low.");
                    }
                    else {
                        this.errorMessage = error.error.error;
                        this.warningDialog.show();
                        // alert(error.error.error);
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
                            // this.routerExtensions.navigate(['./profile'], {
                            //     clearHistory: true,
                            // });

                            this.routerExtensions.back();

                            // if (this.from == "cart") {
                            //     this.router.navigate(['./cart']);
                            // }
                            // else {
                            //     this.router.navigate(['./profile']);
                            // }
                        }
                    }
                }, error => {
                    this.userService.showLoadingState(false);
                    if (error.error.error == undefined) {
                        this.errorMessage = "May be your network connection is low.";
                        this.warningDialog.show();
                        // alert("Something went wrong!!! May be your network connection is low.");
                    }
                    else {
                        this.errorMessage = error.error.error;
                        this.warningDialog.show();
                        // alert(error.error.error);
                    }
                });
        }
    }

    onAddAddress() {
        if (this.address == "") {
            this.errorMessage = "Please enter address.";
            this.warningDialog.show();
            // alert("Please enter address!!!");
        }
        else if (this.mapAddress == "") {
            this.errorMessage = "Please select map address.";
            this.warningDialog.show();
            // alert("Please select map address!!!");
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
        // if (this.from == "cart") {
        //     this.routerExtensions.navigate(['./cart'], {
        //         clearHistory: true,
        //     });
        // } else {
        //     this.routerExtensions.navigate(['./profile'], {
        //         clearHistory: true,
        //     });
        // }
    }

    onMap() {
        this.pinLocation = true;
        this.mapAddress = "";
        // this.userService.showLoadingState(true);

        geolocation.enableLocationRequest();

        var that = this;

        // geolocation.getCurrentLocation({ desiredAccuracy: Accuracy.high, updateDistance: 2, maximumAge: 20000, timeout: 20000 }).
        //     then(function (location) {
        //         if (location) {
        //             that.latitude = location.latitude;
        //             that.longitude = location.longitude;

        //             // directions.navigate({
        //             //     from: { // optional, default 'current location'
        //             //         lat: location.latitude,
        //             //         lng: location.longitude

        //             //     },
        //             //     // to: [{ // if an Array is passed (as in this example), the last item is the destination, the addresses in between are 'waypoints'.
        //             //     //     address: "Hof der Kolommen 34, Amersfoort, Netherlands",
        //             //     // },
        //             //     // {
        //             //     //     address: "Aak 98, Wieringerwerf, Netherlands"
        //             //     // }],
        //             //     to: {
        //             //         // address: "Ivy Hospital, sector 71, Mohali"
        //             //         // lat: location.latitude,
        //             //         // lng: location.longitude
        //             //         lat: 30.7091987,
        //             //         lng: 76.7023474
        //             //     },
        //             //     type: "driving", // optional, can be: driving, transit, bicycling or walking
        //             //     ios: {
        //             //         preferGoogleMaps: true, // If the Google Maps app is installed, use that one instead of Apple Maps, because it supports waypoints. Default true.
        //             //         allowGoogleMapsWeb: true // If waypoints are passed in and Google Maps is not installed, you can either open Apple Maps and the first waypoint is used as the to-address (the rest is ignored), or you can open Google Maps on web so all waypoints are shown (set this property to true). Default false.
        //             //     }
        //             // }).then(() => {
        //             //     console.log("Maps app launched.");
        //             // }, error => {
        //             //     console.log(error);
        //             // });

        //             that.http
        //                 .get(Values.GOOGLE_MAP_URL + "latlng=" + that.latitude + "," + that.longitude + "&key=AIzaSyA3-BQmJVYB6_soLJPv7cx2lFUMAuELlkM")
        //                 .subscribe((res: any) => {
        //                     that.userService.showLoadingState(false);
        //                     // that.address = res.results[0].address_components[0].long_name;
        //                     that.mapAddress = res.results[0].formatted_address;
        //                 }, error => {
        //                     console.log(error);
        //                 });

        //         }
        //     }, function (e) {
        //         console.log("Error: " + e.message);
        //     });


    }

    onSelectLocation() {
        this.mapView.removeAllMarkers();

        this.pinLocation = false;
        this.isLoading = true;

        this.http
            .get(Values.GOOGLE_MAP_URL + "latlng=" + this.finalLatitude + "," + this.finalLongitude + "&key=AIzaSyA3-BQmJVYB6_soLJPv7cx2lFUMAuELlkM")
            .subscribe((res: any) => {
                this.mapLabelClass = false;

                this.mapAddress = res.results[0].formatted_address;
                this.isLoading = false;

            }, error => {
                this.mapLabelClass = false;

                Toast.makeText('Could not get Address', 'long')
                console.log(error);
                this.isLoading = false;
            });
    }

}
