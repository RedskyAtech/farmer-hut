import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { OrderHistoryComponent } from "./components/order-history.component";

const routes: Routes = [
    { path: "", component: OrderHistoryComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class OrderHistoryRoutingModule { }
