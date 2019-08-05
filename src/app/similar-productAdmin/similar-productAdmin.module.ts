import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { HttpModule } from '@angular/http';
import { NativeScriptHttpModule } from "nativescript-angular/http";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { GridViewModule } from 'nativescript-grid-view/angular';
import { NgModalModule } from "../modals/ng-modal";
import { SimilarProductAdminRoutingModule } from "./similar-productAdmin-routing.module";
import { SimilarProductAdminComponent } from "./components/similar-productAdmin.component";

@NgModule({
    imports: [
        HttpModule,
        SimilarProductAdminRoutingModule,
        GridViewModule,
        NgModalModule,
        NativeScriptHttpModule,
        NativeScriptFormsModule,
        NativeScriptCommonModule,
        NativeScriptHttpClientModule
    ],
    declarations: [
        SimilarProductAdminComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})

export class SimilarProductAdminModule { }
