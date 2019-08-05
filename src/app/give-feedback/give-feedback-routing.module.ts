import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { GiveFeedbackComponent } from "./components/give-feedback.component";

const routes: Routes = [
    { path: "", component: GiveFeedbackComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class GiveFeedbackRoutingModule { }
