import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { ViewFeedbackComponent } from "./components/view-feedback.component";

const routes: Routes = [
    { path: "", component: ViewFeedbackComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class ViewFeedbackRoutingModule { }
