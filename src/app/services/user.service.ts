import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()
export class UserService {
    private _showloadingState = new Subject<boolean>();

    showloadingState = this._showloadingState.asObservable();

    constructor() { }

    showLoadingState(state: boolean) {
        this._showloadingState.next(state);
    }

}