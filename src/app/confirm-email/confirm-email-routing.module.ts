import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { ConfirmEmailComponent } from "./components/confirm-email.component";

const routes: Routes = [
    { path: "", component: ConfirmEmailComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class ConfirmEmailRoutingModule { }
