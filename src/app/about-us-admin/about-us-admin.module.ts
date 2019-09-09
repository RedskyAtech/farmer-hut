import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { HttpModule } from '@angular/http';
import { NativeScriptHttpModule } from "nativescript-angular/http";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { GridViewModule } from 'nativescript-grid-view/angular';
import { AboutUsAdminRoutingModule } from "./about-us-admin-routing.module";
import { AboutUsAdminComponent } from "./components/about-us-admin.component";
import { NgModalModule } from "../modals/ng-modal";


@NgModule({
    imports: [
        HttpModule,
        AboutUsAdminRoutingModule,
        GridViewModule,
        NgModalModule,
        NativeScriptHttpModule,
        NativeScriptFormsModule,
        NativeScriptCommonModule,
        NativeScriptHttpClientModule
    ],
    declarations: [
        AboutUsAdminComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})

export class AboutUsAdminModule { }
