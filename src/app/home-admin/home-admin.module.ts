import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { HttpModule } from '@angular/http';
import { NativeScriptHttpModule } from "nativescript-angular/http";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { GridViewModule } from 'nativescript-grid-view/angular';
import { NgModalModule } from "../modals/ng-modal";
import { HomeAdminRoutingModule } from "./home-admin-routing.module";
import { HomeAdminComponent } from "./components/home-admin.component";

@NgModule({
    imports: [
        HttpModule,
        HomeAdminRoutingModule,
        GridViewModule,
        NgModalModule,
        NativeScriptHttpModule,
        NativeScriptFormsModule,
        NativeScriptCommonModule,
        NativeScriptHttpClientModule
    ],
    declarations: [
        HomeAdminComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})

export class HomeAdminModule { }
