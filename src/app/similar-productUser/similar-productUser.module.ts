import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { HttpModule } from '@angular/http';
import { NativeScriptHttpModule } from "nativescript-angular/http";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { GridViewModule } from 'nativescript-grid-view/angular';
import { NgModalModule } from "../modals/ng-modal";
import { SimilarProductUserRoutingModule } from "./similar-productUser-routing.module";
import { SimilarProductUserComponent } from "./components/similar-productUser.component";

@NgModule({
    imports: [
        HttpModule,
        SimilarProductUserRoutingModule,
        GridViewModule,
        NgModalModule,
        NativeScriptHttpModule,
        NativeScriptFormsModule,
        NativeScriptCommonModule,
        NativeScriptHttpClientModule
    ],
    declarations: [
        SimilarProductUserComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})

export class SimilarProductUserModule { }
