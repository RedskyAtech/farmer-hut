import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { GridViewModule } from "nativescript-grid-view/angular";
import { HttpClientModule } from "@angular/common/http";
import { UserService } from "./services/user.service";
import { NavigationService } from "./services/navigation.service";

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        AppRoutingModule,
        GridViewModule,
        HttpClientModule
    ],
    declarations: [
        AppComponent,
    ],
    providers: [UserService, NavigationService],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/
export class AppModule { }
