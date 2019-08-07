import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { ConfirmPhoneComponent } from "./components/confirm-phone.component";

const routes: Routes = [
    { path: "", component: ConfirmPhoneComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class ConfirmPhoneRoutingModule { }
