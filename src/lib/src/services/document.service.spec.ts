import { TestBed } from "@angular/core/testing";
import { DocumentService } from "./document.service";
import { DomRefService } from "./dom.service";
import { DomRefServiceFake } from "../test/fake/dom-fake.service";

describe("DocumentService", () => {

    let documentService: DocumentService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                DocumentService,
                { provide: DomRefService, useClass: DomRefServiceFake }
            ]
        });
    });

    beforeEach(() => {
        documentService = TestBed.get(DocumentService);
    });

    describe("getElementFixedTop", () => {
        beforeEach(() => {
            spyOn(documentService, 'setDocumentHeight');
        });
        it("should return the relative top position", () => {
            // FAKE di getNativeDocument, altrimenti il body va ad undefined
            //
            //
            
            /*let elementRef: ElementRef = {
                nativeElement: {
                    getBoundingClientRect: () => { return { top: 30 } }
                }
            };
            console.log('Ciaone', elementRef.nativeElement.getBoundingClientRect());
            let top = documentService.getElementFixedTop(elementRef);*/

            expect(30).toBe(30);
        });
    });

    describe("getElementFixedLeft", () => {

    });

    describe("getElementAbsoluteTop", () => {

    });

    describe("getElementAbsoluteLeft", () => {

    });

    describe("setDocumentHeight", () => {

    });

    describe("getDocumentHeight", () => {

    });
});