import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { SimilarProductUserComponent } from "./components/similar-productUser.component";

const routes: Routes = [
    { path: "", component: SimilarProductUserComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class SimilarProductUserRoutingModule { }
