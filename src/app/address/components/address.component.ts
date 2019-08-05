import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import * as geolocation from "nativescript-geolocation";
import { Accuracy } from "tns-core-modules/ui/enums";
import { Directions } from "nativescript-directions";
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { Values } from "~/app/values/values";
import { User } from "~/app/models/user.model";
import { Location } from "~/app/models/location.model";
import * as localstorage from "nativescript-localstorage";
import { Address } from "../../models/address.model";
import * as Toast from 'nativescript-toast';
import { UserService } from "../../services/user.service";
import { DeliveryAddress } from "../../models/delivery-address.model";
let directions = new Directions();

@Component({
    selector: "ns-address",
    moduleId: module.id,
    templateUrl: "./address.component.html",
    styleUrls: ["./address.component.css"]
})
export class AddressComponent implements OnInit {

    addressBorderColor = "white";
    mapAddressBorderColor = "white";
    cityBorderColor = "#E98A02";
    districtBorderColor = "#E98A02";
    stateBorderColor = "#E98A02";
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

    constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router, private userService: UserService) {
        this.user = new User();
        this.user.address = new Address();
        this.user.address.location = new Location();
        this.user.deliveryAddress = new DeliveryAddress();
        this.user.deliveryAddress.location = new Location();
        this.address = "";
        this.mapAddress = "";
        // this.route.queryParams.subscribe(params => {
        //     this.city = params["city"];
        //     this.district = params["district"];
        //     this.state = params["state"];
        // });
        this.city = "Abohar";
        this.district = "Fazilka";

        this.route.queryParams.subscribe(params => {
            if (params["from"] != "") {
                this.from = params["from"];
            }
        });

        if (localstorage.getItem("userToken") != null && localstorage.getItem("userToken") && localstorage.getItem("userId") != null && localstorage.getItem("userId") != undefined) {
            this.userId = localstorage.getItem("userId");
        }
        if (localstorage.getItem("adminToken") != null && localstorage.getItem("adminToken") && localstorage.getItem("adminId") != null && localstorage.getItem("adminId") != undefined) {
            this.adminId = localstorage.getItem("adminId");
        }
    }

    ngOnInit(): void {
    }

    onAddressTextChanged(args) {
        this.addressBorderColor = "#E98A02";
        this.address = args.object.text;
    }
    onMapAddressTextChanged(args) {
        this.mapAddressBorderColor = "#E98A02";
        this.mapAddress = args.object.text;
    }
    // onCityTextChanged(args) {
    //     this.addressBorderColor = "white";
    //     this.cityBorderColor = "#E98A02";
    //     this.districtBorderColor = "white";
    //     this.stateBorderColor = "white";
    //     this.pincodeBorderColor = "white";
    //     this.city = args.object.text.toLowerCase();
    // }
    // onDistrictTextChanged(args) {
    //     this.addressBorderColor = "white";
    //     this.cityBorderColor = "white";
    //     this.districtBorderColor = "#E98A02";
    //     this.stateBorderColor = "white";
    //     this.pincodeBorderColor = "white";
    //     this.district = args.object.text.toLowerCase();
    // }
    // onStateTextChanged(args) {
    //     this.addressBorderColor = "white";
    //     this.cityBorderColor = "white";
    //     this.districtBorderColor = "white";
    //     this.stateBorderColor = "#E98A02";
    //     this.pincodeBorderColor = "white";
    //     this.state = args.object.text.toLowerCase();
    // }
    // onPincodeTextChanged(args) {
    //     this.addressBorderColor = "white";
    //     this.cityBorderColor = "white";
    //     this.districtBorderColor = "white";
    //     this.stateBorderColor = "white";
    //     this.pincodeBorderColor = "#E98A02";
    //     this.pincode = args.object.text.toLowerCase();
    // }

    addAddress(id: string) {
        if (this.from == "cart") {
            this.user.deliveryAddress.line1 = this.address;
            this.user.deliveryAddress.line2 = this.mapAddress;
            this.user.deliveryAddress.location.latitude = this.latitude;
            this.user.deliveryAddress.location.longitude = this.longitude;
            this.http
                .put(Values.BASE_URL + "users/update/" + id, this.user)
                .subscribe((res: any) => {
                    if (res != "" && res != undefined) {
                        if (res.isSuccess == true) {
                            this.userService.showLoadingState(false);
                            Toast.makeText("Delivery address added successfully!!!", "long").show();
                            this.router.navigate(['./cart']);
                        }
                    }
                }, error => {
                    this.userService.showLoadingState(false);
                    alert(error.error.error);
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
                            this.router.navigate(['./profile']);
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
                    alert(error.error.error);
                });
        }
    }

    onAddAddress() {
        if (this.address == "") {
            alert("Please enter address!!!");
        }
        else if (this.mapAddress == "") {
            alert("Please select map address!!!");
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
        if (this.from == "cart") {
            this.router.navigate(['./cart']);
        } else {
            this.router.navigate(['./profile']);
        }
    }

    onMap() {
        this.mapAddress = "";
        this.userService.showLoadingState(true);
        geolocation.enableLocationRequest();
        var that = this;
        geolocation.getCurrentLocation({ desiredAccuracy: Accuracy.high, updateDistance: 2, maximumAge: 20000, timeout: 20000 }).
            then(function (location) {
                if (location) {
                    that.latitude = location.latitude;
                    that.longitude = location.longitude;

                    // directions.navigate({
                    //     from: { // optional, default 'current location'
                    //         lat: location.latitude,
                    //         lng: location.longitude

                    //     },
                    //     // to: [{ // if an Array is passed (as in this example), the last item is the destination, the addresses in between are 'waypoints'.
                    //     //     address: "Hof der Kolommen 34, Amersfoort, Netherlands",
                    //     // },
                    //     // {
                    //     //     address: "Aak 98, Wieringerwerf, Netherlands"
                    //     // }],
                    //     to: {
                    //         // address: "Ivy Hospital, sector 71, Mohali"
                    //         // lat: location.latitude,
                    //         // lng: location.longitude
                    //         lat: 30.7091987,
                    //         lng: 76.7023474
                    //     },
                    //     type: "driving", // optional, can be: driving, transit, bicycling or walking
                    //     ios: {
                    //         preferGoogleMaps: true, // If the Google Maps app is installed, use that one instead of Apple Maps, because it supports waypoints. Default true.
                    //         allowGoogleMapsWeb: true // If waypoints are passed in and Google Maps is not installed, you can either open Apple Maps and the first waypoint is used as the to-address (the rest is ignored), or you can open Google Maps on web so all waypoints are shown (set this property to true). Default false.
                    //     }
                    // }).then(() => {
                    //     console.log("Maps app launched.");
                    // }, error => {
                    //     console.log(error);
                    // });

                    that.http
                        .get(Values.GOOGLE_MAP_URL + "latlng=" + that.latitude + "," + that.longitude + "&key=AIzaSyA3-BQmJVYB6_soLJPv7cx2lFUMAuELlkM")
                        .subscribe((res: any) => {
                            that.userService.showLoadingState(false);
                            // that.address = res.results[0].address_components[0].long_name;
                            that.mapAddress = res.results[0].formatted_address;
                        }, error => {
                            console.log(error);
                        });

                }
            }, function (e) {
                console.log("Error: " + e.message);
            });
    }
}
