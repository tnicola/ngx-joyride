import { Injectable } from '@angular/core';

@Injectable()
export class DomRefServiceFake {
    getNativeWindow: jasmine.Spy = jasmine.createSpy("getNativeWindow").and.returnValue(window);
    getNativeDocument: jasmine.Spy = jasmine.createSpy("getNativeDocument");
}