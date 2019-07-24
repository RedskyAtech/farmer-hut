import { NO_ERRORS_SCHEMA, NgModule } from "@angular/core"
import { ModalComponent } from "./modal.component";
// import { NativeScriptUIGaugeModule } from "nativescript-ui-gauge/angular/gauges-directives";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptFormsModule } from "nativescript-angular/forms";

@NgModule({
    imports: [
        // NativeScriptUIGaugeModule,
        NativeScriptCommonModule,
        NativeScriptFormsModule
    ],
    declarations: [
        ModalComponent,
    ],
    exports: [ModalComponent],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class NgModalModule { }