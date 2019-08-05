import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { HomeAdminComponent } from "./components/home-admin.component";

const routes: Routes = [
    { path: "", component: HomeAdminComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class HomeAdminRoutingModule { }
