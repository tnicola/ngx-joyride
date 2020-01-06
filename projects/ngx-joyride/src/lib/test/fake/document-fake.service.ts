import { Injectable } from '@angular/core';
import { IDocumentService } from '../../services/document.service';

@Injectable()
export class DocumentServiceFake implements IDocumentService {
    getElementAbsoluteTop: jasmine.Spy = jasmine.createSpy('getElementAbsoluteTop');
    getElementAbsoluteLeft: jasmine.Spy = jasmine.createSpy('getElementAbsoluteLeft');
    setDocumentHeight: jasmine.Spy = jasmine.createSpy('setDocumentHeight');
    getDocumentHeight: jasmine.Spy = jasmine.createSpy('getDocumentHeight');
    getElementFixedTop: jasmine.Spy = jasmine.createSpy('getElementFixedTop');
    getElementFixedLeft: jasmine.Spy = jasmine.createSpy('getElementFixedLeft');
    isElementBeyondOthers: jasmine.Spy = jasmine.createSpy('isElementBeyondOthers');
    isParentScrollable: jasmine.Spy = jasmine.createSpy('isParentScrollable');
    scrollToTheTop: jasmine.Spy = jasmine.createSpy('scrollToTheTop');
    scrollToTheBottom: jasmine.Spy = jasmine.createSpy('scrollToTheBottom');
}
