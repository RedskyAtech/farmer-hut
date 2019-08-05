import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { ViewOrdersComponent } from "./components/view-orders.component";

const routes: Routes = [
    { path: "", component: ViewOrdersComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class ViewOrdersRoutingModule { }
