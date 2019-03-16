import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class DomRefService {
    private fakeDocument: Document = <Document>{ body: {}, documentElement: {} };
    private fakeWindow: Window = <Window>{ document: this.fakeDocument, navigator: {} };
    constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
    getNativeWindow(): Window {
        if (isPlatformBrowser(this.platformId)) return window;
        else return this.fakeWindow;
    }

    getNativeDocument() {
        if (isPlatformBrowser(this.platformId)) return document;
        else return this.fakeDocument;
    }
}