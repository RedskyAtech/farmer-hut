import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { HttpModule } from '@angular/http';
import { NativeScriptHttpModule } from "nativescript-angular/http";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { GridViewModule } from 'nativescript-grid-view/angular';
import { NgModalModule } from "../modals/ng-modal";
import { MyOrderDetailRoutingModule } from "./my-order-detail-routing.module";
import { MyOrderDetailComponent } from "./components/my-order-detail.component";

@NgModule({
    imports: [
        HttpModule,
        MyOrderDetailRoutingModule,
        GridViewModule,
        NgModalModule,
        NativeScriptHttpModule,
        NativeScriptFormsModule,
        NativeScriptCommonModule,
        NativeScriptHttpClientModule
    ],
    declarations: [
        MyOrderDetailComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})

export class MyOrderDetailModule { }
