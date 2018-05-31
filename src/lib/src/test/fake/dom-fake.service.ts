import { Injectable } from '@angular/core';

@Injectable()
export class DomRefServiceFake {
    getNativeWindow: jasmine.Spy = jasmine.createSpy("getNativeWindow");
    getNativeDocument: jasmine.Spy = jasmine.createSpy("getNativeDocument");
}