import { TestBed, async } from '@angular/core/testing';
import { JoyrideBackdropService } from './joyride-backdrop.service';
import { DocumentServiceFake } from '../test/fake/document-fake.service';
import { DocumentService } from './document.service';
import { JoyrideOptionsServiceFake } from '../test/fake/joyride-options-fake.service';
import { JoyrideOptionsService } from './joyride-options.service';
import { JoyrideStep } from '../models/joyride-step.class';
import { FakeElementRef, FakeViewContainerRef } from '../test/fake/dom-elements-fake.class';
import { Scroll } from './event-listener.service';

describe('JoyrideBackdropService', () => {
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

    describe('draw()', () => {
        it('should create a backdrop-container', () => {
            backdropService.draw(STEP);

            let backdropContainer = document.getElementsByClassName('backdrop-container')[0];
            let styles = window.getComputedStyle(backdropContainer);

            expect(backdropContainer).not.toBe(null);
            expect(styles.position).toBe('fixed');
            expect(styles.top).toBe('0px');
            expect(styles.left).toBe('0px');
            expect(styles.getPropertyValue('z-index')).toBe('1000');
        });

        it('should create a backdrop-content', () => {
            backdropService.draw(STEP);

            let backdropContent = document.getElementsByClassName('backdrop-content')[0];
            let styles = window.getComputedStyle(backdropContent);

            expect(backdropContent).not.toBe(null);
            expect(styles.position).toBe('relative');
            expect(styles.display).toBe('flex');
            expect(styles.getPropertyValue('flex-direction')).toBe('column');
        });

        it('should create a backdrop-middle-container', () => {
            backdropService.draw(STEP);

            let backdropMiddleContainer = document.getElementsByClassName('backdrop-middle-container')[0];
            let styles = window.getComputedStyle(backdropMiddleContainer);

            expect(backdropMiddleContainer).not.toBe(null);
            expect(styles.height).toBe('34px');
            expect(styles.getPropertyValue('flex-shrink')).toBe('0');
        });

        it('should draw again if I call draw(), remove() and then draw()', () => {
            backdropService.draw(STEP);
            backdropService.remove();
            backdropService.draw(STEP);

            let backdropMiddleContainer = document.getElementsByClassName('backdrop-middle-container')[0];
            let styles = window.getComputedStyle(backdropMiddleContainer);

            expect(backdropMiddleContainer).not.toBe(null);
            expect(styles.height).toBe('34px');
            expect(styles.getPropertyValue('flex-shrink')).toBe('0');
        });

        it('should set id to contain step name', () => {
            STEP.name = 'myStep';
            backdropService.draw(STEP);

            let backdropMiddleContainer = document.getElementsByClassName('backdrop-container')[0];
            expect(backdropMiddleContainer.id).toBe('backdrop-myStep');
        });
    });

    describe('redraw() and redrawTarget()', () => {
        describe('when the target element is NOT fixed', () => {
            beforeEach(() => {
                STEP.isElementOrAncestorFixed = false;
            });

            it('should set the leftBackdrop width to the absolute one', () => {
                documentService.getElementAbsoluteLeft.and.returnValue(57);
                documentService.getElementFixedLeft.and.returnValue(13);

                backdropService.draw(STEP);
                backdropService.redrawTarget(STEP);

                let backdropLeftContainer = document.getElementsByClassName('joyride-backdrop backdrop-left')[0];
                let styles = window.getComputedStyle(backdropLeftContainer);

                expect(styles.width).toBe('57px');
            });

            it('should set the leftBackdrop width to (absolute - lastXScroll) after some some scroll events', () => {
                documentService.getElementAbsoluteLeft.and.returnValue(57);
                documentService.getElementFixedLeft.and.returnValue(13);

                backdropService.draw(STEP);
                backdropService.redraw(STEP, <Scroll>{ scrollX: 10, scrollY: 20 });
                backdropService.redraw(STEP, <Scroll>{ scrollX: 3, scrollY: 5 });
                backdropService.redrawTarget(STEP);

                let backdropLeftContainer = document.getElementsByClassName('joyride-backdrop backdrop-left')[0];
                let styles = window.getComputedStyle(backdropLeftContainer);

                expect(styles.width).toBe('54px');
            });

            it('should set the topBackdrop height to the absolute one', () => {
                documentService.getElementAbsoluteTop.and.returnValue(42);
                documentService.getElementFixedTop.and.returnValue(18);

                backdropService.draw(STEP);
                backdropService.redrawTarget(STEP);

                let backdropTopContainer = document.getElementsByClassName('joyride-backdrop backdrop-top')[0];
                let styles = window.getComputedStyle(backdropTopContainer);

                expect(styles.height).toBe('42px');
            });

            it('should set the topBackdrop height to (absolute - lastYScroll) after some some scroll events', () => {
                documentService.getElementAbsoluteTop.and.returnValue(42);
                documentService.getElementFixedTop.and.returnValue(18);

                backdropService.draw(STEP);
                backdropService.redraw(STEP, <Scroll>{ scrollX: 10, scrollY: 20 });
                backdropService.redraw(STEP, <Scroll>{ scrollX: 3, scrollY: 5 });
                backdropService.redrawTarget(STEP);

                let backdropTopContainer = document.getElementsByClassName('joyride-backdrop backdrop-top')[0];
                let styles = window.getComputedStyle(backdropTopContainer);

                expect(styles.height).toBe('37px');
            });

            describe('when the target is partially hidden top after a scroll', () => {
                beforeEach(() => {
                    documentService.getElementAbsoluteTop.and.returnValue(10);
                });
                it('should set the topBackdrop height to 0px', () => {
                    backdropService.draw(STEP);
                    backdropService.redraw(STEP, <Scroll>{ scrollX: 10, scrollY: 20 });
                    backdropService.redrawTarget(STEP);

                    let backdropTopContainer = document.getElementsByClassName('joyride-backdrop backdrop-top')[0];
                    let styles = window.getComputedStyle(backdropTopContainer);

                    expect(styles.height).toBe('0px');
                });

                it('should set the backdropMiddleContainer height to the partial view height of the target', () => {
                    let ELEMENT_REF_HIDDEN_PARTIALLY = new FakeElementRef();
                    ELEMENT_REF_HIDDEN_PARTIALLY.nativeElement.offsetHeight = 20;
                    STEP.targetViewContainer = new FakeViewContainerRef(ELEMENT_REF_HIDDEN_PARTIALLY);

                    backdropService.draw(STEP);
                    backdropService.redraw(STEP, <Scroll>{ scrollX: 10, scrollY: 20 });
                    backdropService.redrawTarget(STEP);

                    let backdropMiddleContainer = document.getElementsByClassName('backdrop-middle-container')[0];
                    let styles = window.getComputedStyle(backdropMiddleContainer);

                    expect(styles.height).toBe('10px');
                });

                it('should set the backdropMiddleContainer height to the partial view height of the target', () => {
                    let ELEMENT_REF_HIDDEN_PARTIALLY = new FakeElementRef();
                    ELEMENT_REF_HIDDEN_PARTIALLY.nativeElement.offsetHeight = 2;
                    STEP.targetViewContainer = new FakeViewContainerRef(ELEMENT_REF_HIDDEN_PARTIALLY);

                    backdropService.draw(STEP);
                    backdropService.redraw(STEP, <Scroll>{ scrollX: 10, scrollY: 20 });
                    backdropService.redrawTarget(STEP);

                    let backdropMiddleContainer = document.getElementsByClassName('backdrop-middle-container')[0];
                    let styles = window.getComputedStyle(backdropMiddleContainer);

                    expect(styles.height).toBe('0px');
                });
            });

            describe('when the target is partially hidden left after a scroll', () => {
                beforeEach(() => {
                    documentService.getElementAbsoluteLeft.and.returnValue(10);
                });
                it('should set the leftBackdrop width to 0px', () => {
                    backdropService.draw(STEP);
                    backdropService.redraw(STEP, <Scroll>{ scrollX: 20, scrollY: 15 });
                    backdropService.redrawTarget(STEP);

                    let backdropLeftContainer = document.getElementsByClassName('joyride-backdrop backdrop-left')[0];
                    let styles = window.getComputedStyle(backdropLeftContainer);

                    expect(styles.width).toBe('0px');
                });

                it('should set the targetBackdrop width to the partial view height of the target', () => {
                    let ELEMENT_REF_HIDDEN_PARTIALLY = new FakeElementRef();
                    ELEMENT_REF_HIDDEN_PARTIALLY.nativeElement.offsetWidth = 20;
                    STEP.targetViewContainer = new FakeViewContainerRef(ELEMENT_REF_HIDDEN_PARTIALLY);

                    backdropService.draw(STEP);
                    backdropService.redraw(STEP, <Scroll>{ scrollX: 20, scrollY: 15 });
                    backdropService.redrawTarget(STEP);

                    let backdropTarget = document.getElementsByClassName('backdrop-target')[0];
                    let styles = window.getComputedStyle(backdropTarget);

                    expect(styles.width).toBe('10px');
                });

                it('should set the targetBackdrop width to the partial view height of the target', () => {
                    let ELEMENT_REF_HIDDEN_PARTIALLY = new FakeElementRef();
                    ELEMENT_REF_HIDDEN_PARTIALLY.nativeElement.offsetWidth = 2;
                    STEP.targetViewContainer = new FakeViewContainerRef(ELEMENT_REF_HIDDEN_PARTIALLY);

                    backdropService.draw(STEP);
                    backdropService.redraw(STEP, <Scroll>{ scrollX: 20, scrollY: 15 });
                    backdropService.redrawTarget(STEP);

                    let backdropTarget = document.getElementsByClassName('backdrop-target')[0];
                    let styles = window.getComputedStyle(backdropTarget);

                    expect(styles.width).toBe('0px');
                });
            });
        });
        describe('when the target element is fixed', () => {
            beforeEach(() => {
                STEP.isElementOrAncestorFixed = true;
            });

            it('should set the leftBackdrop width to the fixed one', () => {
                documentService.getElementAbsoluteLeft.and.returnValue(57);
                documentService.getElementFixedLeft.and.returnValue(13);

                backdropService.draw(STEP);
                backdropService.redrawTarget(STEP);

                let backdropLeftContainer = document.getElementsByClassName('joyride-backdrop backdrop-left')[0];
                let styles = window.getComputedStyle(backdropLeftContainer);

                expect(styles.width).toBe('13px');
            });

            it('should set the leftBackdrop width to the fixed one after some scrolls events', () => {
                documentService.getElementAbsoluteLeft.and.returnValue(57);
                documentService.getElementFixedLeft.and.returnValue(13);

                backdropService.draw(STEP);
                backdropService.redraw(STEP, <Scroll>{ scrollX: 10, scrollY: 20 });
                backdropService.redraw(STEP, <Scroll>{ scrollX: 3, scrollY: 5 });
                backdropService.redrawTarget(STEP);

                let backdropLeftContainer = document.getElementsByClassName('joyride-backdrop backdrop-left')[0];
                let styles = window.getComputedStyle(backdropLeftContainer);

                expect(styles.width).toBe('13px');
            });

            it('should set the topBackdrop height to the fixed one', () => {
                documentService.getElementAbsoluteTop.and.returnValue(42);
                documentService.getElementFixedTop.and.returnValue(18);

                backdropService.draw(STEP);
                backdropService.redrawTarget(STEP);

                let backdropTopContainer = document.getElementsByClassName('joyride-backdrop backdrop-top')[0];
                let styles = window.getComputedStyle(backdropTopContainer);

                expect(styles.height).toBe('18px');
            });

            it('should set the topBackdrop height to the fixed one after some some scroll events', () => {
                documentService.getElementAbsoluteTop.and.returnValue(42);
                documentService.getElementFixedTop.and.returnValue(18);

                backdropService.draw(STEP);
                backdropService.redraw(STEP, <Scroll>{ scrollX: 10, scrollY: 20 });
                backdropService.redraw(STEP, <Scroll>{ scrollX: 3, scrollY: 5 });
                backdropService.redrawTarget(STEP);

                let backdropTopContainer = document.getElementsByClassName('joyride-backdrop backdrop-top')[0];
                let styles = window.getComputedStyle(backdropTopContainer);

                expect(styles.height).toBe('18px');
            });
        });
    });

    describe('remove()', () => {
        it('should remove the backdrop from the DOM', () => {
            backdropService.draw(STEP);
            backdropService.remove();

            let backdropContainer = document.getElementsByClassName('backdrop-container')[0];

            expect(backdropContainer).toBeUndefined();
        });
    });

    afterEach(() => {
        backdropService.remove();
    });
});
