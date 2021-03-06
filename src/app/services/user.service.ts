import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()
export class UserService {
    private _showloadingState = new Subject<boolean>();
    private _activescreen = new Subject<string>();
    private _sliderservice = new Subject<string>();

    showloadingState = this._showloadingState.asObservable();
    activescreen = this._activescreen.asObservable();
    sliderservice = this._sliderservice.asObservable();

    currentPage: string;

    constructor() { }

    showLoadingState(state: boolean) {
        this._showloadingState.next(state);
    }

    activeScreen(screen: string) {
        this._activescreen.next(screen);
        this.currentPage = screen
    }

    sliderScreen(slider: string) {
        this._sliderservice.next(slider);
    }

}