import { Injectable } from "@angular/core";

@Injectable()
export class DocumentServiceFake {

    getElementAbsoluteTop: jasmine.Spy = jasmine.createSpy("getElementAbsoluteTop");
    getElementAbsoluteLeft: jasmine.Spy = jasmine.createSpy("getElementAbsoluteLeft");
    getElementAbsoluteRight: jasmine.Spy = jasmine.createSpy("getElementAbsoluteRight");
    setDocumentHeight: jasmine.Spy = jasmine.createSpy("setDocumentHeight");
    getDocumentHeight: jasmine.Spy = jasmine.createSpy("getDocumentHeight");
    getElementFixedTop: jasmine.Spy = jasmine.createSpy("getElementFixedTop");
    getElementFixedLeft: jasmine.Spy = jasmine.createSpy("getElementFixedLeft");
}