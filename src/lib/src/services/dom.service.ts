import { Injectable } from '@angular/core';

@Injectable()
export class DomRefService {
    getNativeWindow(): any {
        return window;
    }

    getNativeDocument() {
        return document;
    }
}