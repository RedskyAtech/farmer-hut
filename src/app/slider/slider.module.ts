import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { SliderComponent } from "./components/slider.component";


@NgModule({
    imports: [NativeScriptCommonModule],
    declarations: [SliderComponent],
    schemas: [NO_ERRORS_SCHEMA],
    exports: [SliderComponent]
})

export class SliderModule { }