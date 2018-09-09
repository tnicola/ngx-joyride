import { TestBed, async } from "@angular/core/testing";
import { JoyrideBackdropService } from "./joyride-backdrop.service";
import { DocumentServiceFake } from "../test/fake/document-fake.service";
import { DocumentService } from "./document.service";
import { JoyrideOptionsServiceFake } from "../test/fake/joyride-options-fake.service";
import { JoyrideOptionsService } from "./joyride-options.service";
import { JoyrideStep } from "../models/joyride-step.class";
import { FakeElementRef, FakeViewContainerRef } from "../test/fake/dom-elements-fake.class";

describe("JoyrideBackdropService", () => {

    let backdropService: JoyrideBackdropService;
    let documentService: DocumentServiceFake;
    let optionsService: DocumentServiceFake;
    let STEP: JoyrideStep;
    let ELEM_REF: FakeElementRef;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                JoyrideBackdropService,
                { provide: DocumentService, useClass: DocumentServiceFake },
                { provide: JoyrideOptionsService, useClass: JoyrideOptionsServiceFake }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        backdropService = TestBed.get(JoyrideBackdropService);
        documentService = TestBed.get(DocumentService);
        optionsService = TestBed.get(DocumentService);
        STEP = new JoyrideStep();
        ELEM_REF = new FakeElementRef();

        STEP.targetViewContainer = new FakeViewContainerRef(ELEM_REF);

    });

    describe("draw()", () => {
        it("should create a backdrop-container", () => {
            backdropService.draw(STEP);

            let backdropContainer = document.getElementsByClassName('backdrop-container')[0]; 
            let styles = window.getComputedStyle(backdropContainer);
            
            expect(backdropContainer).not.toBe(null);
            expect(styles.position).toBe('fixed');
            expect(styles.top).toBe('0px');
            expect(styles.left).toBe('0px');
            expect(styles.getPropertyValue('z-index')).toBe('1000');
        });
        
        it("should create a backdrop-content", () => {
            backdropService.draw(STEP);

            let backdropContent = document.getElementsByClassName('backdrop-content')[0]; 
            let styles = window.getComputedStyle(backdropContent);
            
            expect(backdropContent).not.toBe(null);
            expect(styles.position).toBe('relative');
            expect(styles.display).toBe('flex');
            expect(styles.getPropertyValue('flex-direction')).toBe('column');
        });

        it("should create a backdrop-middle-container", () => {
            backdropService.draw(STEP);

            let backdropMiddleContainer = document.getElementsByClassName('backdrop-middle-container')[0]; 
            let styles = window.getComputedStyle(backdropMiddleContainer);
            
            expect(backdropMiddleContainer).not.toBe(null);
            expect(styles.height).toBe('34px');
            expect(styles.getPropertyValue('flex-shrink')).toBe('0');
        });

        it("should draw again if I call draw(), remove() and then draw()", () => {
            backdropService.draw(STEP);
            backdropService.remove();
            backdropService.draw(STEP);

            let backdropMiddleContainer = document.getElementsByClassName('backdrop-middle-container')[0]; 
            let styles = window.getComputedStyle(backdropMiddleContainer);
            
            expect(backdropMiddleContainer).not.toBe(null);
            expect(styles.height).toBe('34px');
            expect(styles.getPropertyValue('flex-shrink')).toBe('0');
        });

    });
});