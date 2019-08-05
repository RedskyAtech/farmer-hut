import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { HttpModule } from '@angular/http';
import { NativeScriptHttpModule } from "nativescript-angular/http";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { AboutUsRoutingModule } from "./about-us-routing.module";
import { GridViewModule } from 'nativescript-grid-view/angular';
import { AboutUsComponent } from "./components/about-us.component";


@NgModule({
    imports: [
        HttpModule,
        AboutUsRoutingModule,
        GridViewModule,
        NativeScriptHttpModule,
        NativeScriptFormsModule,
        NativeScriptCommonModule,
        NativeScriptHttpClientModule
    ],
    declarations: [
        AboutUsComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})

export class AboutUsModule { }
