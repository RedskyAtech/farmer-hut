import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { MyOrderDetailComponent } from "./components/my-order-detail.component";

const routes: Routes = [
    { path: "", component: MyOrderDetailComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class MyOrderDetailRoutingModule { }
