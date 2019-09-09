import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { AboutUsAdminComponent } from "./components/about-us-admin.component";

const routes: Routes = [
    { path: "", component: AboutUsAdminComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class AboutUsAdminRoutingModule { }
