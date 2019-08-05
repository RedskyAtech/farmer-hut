import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { ForgotPasswordComponent } from "./components/forgot-password.component";

const routes: Routes = [
    { path: "", component: ForgotPasswordComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class ForgotPasswordRoutingModule { }
