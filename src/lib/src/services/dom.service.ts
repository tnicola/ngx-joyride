import { Injectable } from '@angular/core';

function getWindow (): any {
    return window;
}

@Injectable()
export class DomRefService {
    get nativeWindow (): any {
        return getWindow();
    }
}