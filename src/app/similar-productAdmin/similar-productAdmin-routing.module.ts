import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { SimilarProductAdminComponent } from "./components/similar-productAdmin.component";

const routes: Routes = [
    { path: "", component: SimilarProductAdminComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class SimilarProductAdminRoutingModule { }
