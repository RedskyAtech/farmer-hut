/// <reference path="../../../node_modules/tns-platform-declarations/android.d.ts" />

import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BackgroundService } from "./background.service";
import { ad } from "tns-core-modules/utils/utils";


declare module com {
    module tns {
        export class BackgroundService {
            public static class: java.lang.Class<com.tns.BackgroundService>;
        }
    }
}

@Injectable()
export class BackgroundHttpService {

    mainIntent;
    backgroundService;
    context: any

    constructor(private http: HttpClient) {
        this.context = ad.getApplicationContext();

        // this.mainIntent = new android.content.Intent(this.context, com.tns.NativeScriptActivity.class);

        // var intent = new android.content.Intent(this.context, com.tns.BackgroundService.class)
        // this.context.startService(intent);

        this.backgroundService = new BackgroundService();
    }





    get(url: string, options: any): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.backgroundService.onCommand(this.mainIntent, 0, 1, this.http, 'GET', url, options).then((result) => {
                resolve(result);
            }, error => {
                reject(error);
            })
        })
    }

    put(url: string, options: any, body: any): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.backgroundService.onCommand(this.mainIntent, 0, 1, this.http, 'PUT', url, options, body).then((result) => {
                resolve(result)
            }, error => {
                reject(error);
            })
        })
    }

    post(url: string, options: any, body: any): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.backgroundService.onCommand(this.mainIntent, 0, 1, this.http, 'POST', url, options, body).then((result) => {
                resolve(result)
            }, error => {
                reject(error);
            })
        })
    }

}