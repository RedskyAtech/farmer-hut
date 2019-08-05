import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { AddSliderComponent } from "./components/add-slider.component";

const routes: Routes = [
    { path: "", component: AddSliderComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class AddSliderRoutingModule { }
