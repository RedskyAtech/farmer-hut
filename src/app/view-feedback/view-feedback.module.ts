import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { HttpModule } from '@angular/http';
import { NativeScriptHttpModule } from "nativescript-angular/http";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { GridViewModule } from 'nativescript-grid-view/angular';
import { NgModalModule } from "../modals/ng-modal";
import { ViewFeedbackRoutingModule } from "./view-feedback-routing.module";
import { ViewFeedbackComponent } from "./components/view-feedback.component";

@NgModule({
    imports: [
        HttpModule,
        ViewFeedbackRoutingModule,
        GridViewModule,
        NgModalModule,
        NativeScriptHttpModule,
        NativeScriptFormsModule,
        NativeScriptCommonModule,
        NativeScriptHttpClientModule
    ],
    declarations: [
        ViewFeedbackComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})

export class ViewFeedbackModule { }
