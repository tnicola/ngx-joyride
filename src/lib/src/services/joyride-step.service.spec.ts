import { JoyrideStepService } from './joyride-step.service';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { JoyrideBackdropService } from './joyride-backdrop.service';
import { EventListenerServiceFake } from '../test/fake/event-listener-fake.service';
import { EventListenerService } from './event-listener.service';
import { DocumentServiceFake } from '../test/fake/document-fake.service';
import { DomRefServiceFake } from '../test/fake/dom-fake.service';
import { StepDrawerServiceFake } from '../test/fake/step-drawer-fake.service';
import { JoyrideStepsContainerService, StepActionType } from './joyride-steps-container.service';
import { DocumentService } from './document.service';
import { DomRefService } from './dom.service';
import { StepDrawerService } from './step-drawer.service';
import { JoyrideOptionsService } from './joyride-options.service';
import { JoyrideOptionsServiceFake } from '../test/fake/joyride-options-fake.service';
import { JoyrideBackdropServiceFake } from '../test/fake/joyride-backdrop-fake.service';
import { JoyrideStep } from '../models/joyride-step.class';
import { EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { RouterFake } from '../test/fake/router-fake.service';
import { JoyrideStepsContainerServiceFake } from '../test/fake/joyride-steps-container-fake.service';

describe('JoyrideStepService', () => {
    let joyrideStepService: JoyrideStepService;
    let eventListenerService: EventListenerServiceFake;
    let backdropService: JoyrideBackdropServiceFake;
    let documentService: DocumentServiceFake;
    let stepsContainerService: JoyrideStepsContainerServiceFake;
    let domRefService: DomRefServiceFake;
    let stepDrawerService: StepDrawerServiceFake;
    let FAKE_STEPS = <any>[];
    let STEP0: any = new JoyrideStep();
    let STEP1: any = new JoyrideStep();
    let STEP2: any = new JoyrideStep();
    let FAKE_WINDOW: { innerHeight: number; scrollTo: jasmine.Spy };
    let FAKE_DOCUMENT: { body: { scrollHeight: number } };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                JoyrideStepService,
                { provide: Router, useClass: RouterFake },
                { provide: JoyrideBackdropService, useClass: JoyrideBackdropServiceFake },
                { provide: EventListenerService, useClass: EventListenerServiceFake },
                { provide: JoyrideStepsContainerService, useClass: JoyrideStepsContainerServiceFake },
                { provide: DocumentService, useClass: DocumentServiceFake },
                { provide: DomRefService, useClass: DomRefServiceFake },
                { provide: StepDrawerService, useClass: StepDrawerServiceFake },
                { provide: JoyrideOptionsService, useClass: JoyrideOptionsServiceFake }
            ]
        });
    });

    beforeEach(() => {
        domRefService = TestBed.get(DomRefService);
        FAKE_WINDOW = { innerHeight: 200, scrollTo: jasmine.createSpy('scrollTo') };
        FAKE_DOCUMENT = { body: { scrollHeight: 106 } };
        domRefService.getNativeWindow.and.returnValue(FAKE_WINDOW);
        domRefService.getNativeDocument.and.returnValue(FAKE_DOCUMENT);

        joyrideStepService = TestBed.get(JoyrideStepService);
        eventListenerService = TestBed.get(EventListenerService);
        backdropService = TestBed.get(JoyrideBackdropService);
        documentService = TestBed.get(DocumentService);
        stepsContainerService = TestBed.get(JoyrideStepsContainerService);
        stepDrawerService = TestBed.get(StepDrawerService);

        STEP0 = createNewStep('nav');
        STEP1 = createNewStep('credits');
        STEP2 = createNewStep('side-panel');

        FAKE_STEPS = [STEP0, STEP1, STEP2];
        stepsContainerService.get.and.returnValues(...FAKE_STEPS);
    });

    function createNewStep(nextStepName: string = '') {
        let step: any = new JoyrideStep();
        let stepTargetViewContainer = { element: { nativeElement: { scrollIntoView: () => {} } }, remove: jasmine.createSpy('remove') };
        step.targetViewContainer = stepTargetViewContainer;
        step.prevCliked = new EventEmitter();
        step.nextClicked = new EventEmitter();
        step.tourDone = new EventEmitter();
        step.nextStepName = nextStepName;

        return step;
    }

    describe('At the beginning', () => {
        it('should start listening to scroll events', () => {
            expect(eventListenerService.startListeningScrollEvents).toHaveBeenCalledTimes(1);
        });
    });

    describe('when eventListener.scrollEvent publish', () => {
        it("should call backdropService.redraw with the right 'scroll' parameter", () => {
            eventListenerService.scrollEvent.next(240);

            expect(backdropService.redraw).toHaveBeenCalledWith(undefined, 240);
        });
    });

    describe('when eventListener.resizeEvent publish', () => {
        it('should call backdropService.redrawTarget', fakeAsync(() => {
            joyrideStepService.startTour();
            tick(1); //wait for the first step
            eventListenerService.resizeEvent.next();

            expect(backdropService.redrawTarget).toHaveBeenCalled();
        }));
    });

    describe('close()', () => {
        beforeEach(fakeAsync(() => {
            joyrideStepService.startTour();
            tick(1);
            joyrideStepService.close();
        }));
        it('should call backDropService.remove', () => {
            expect(backdropService.remove).toHaveBeenCalled();
        });
        it('should remove the step calling stepDrawerService.remove', () => {
            expect(stepDrawerService.remove).toHaveBeenCalledTimes(1);
            expect(stepDrawerService.remove).toHaveBeenCalledWith(STEP0);
        });
        it('should scroll to 0, 0', () => {
            expect(FAKE_WINDOW.scrollTo).toHaveBeenCalledWith(0, 0);
        });
        it('should call eventListener.stopListeningResizeEvents', () => {
            expect(eventListenerService.stopListeningResizeEvents).toHaveBeenCalledTimes(1);
        });
    });

    describe('startTour()', () => {
        beforeEach(fakeAsync(() => {
            joyrideStepService.startTour();
            tick(1);
        }));
        it('should call documentService.setDocumentHeight', () => {
            expect(documentService.setDocumentHeight).toHaveBeenCalled();
        });
        it('should call stepsContainerService.initSteps', () => {
            expect(stepsContainerService.init).toHaveBeenCalled();
        });
        it('should call stepsContainerService.get with StepActionType.NEXT', () => {
            expect(stepsContainerService.get).toHaveBeenCalledWith(StepActionType.NEXT);
        });
    });

    describe('next', () => {
        beforeEach(fakeAsync(() => {
            joyrideStepService.startTour();
            tick(1);
            backdropService.draw.calls.reset();
            joyrideStepService.next();
            tick(1);
        }));
        it('should remove the step calling stepDrawerService.remove', () => {
            expect(stepDrawerService.remove).toHaveBeenCalledTimes(1);
            expect(stepDrawerService.remove).toHaveBeenCalledWith(STEP0);
        });
        it('should call stepsContainerService.get with StepActionType.NEXT twice', () => {
            expect(stepsContainerService.get.calls.argsFor(0)).toEqual([StepActionType.NEXT]);
            expect(stepsContainerService.get.calls.argsFor(1)).toEqual([StepActionType.NEXT]);
        });
        it('should call stepsContainerService.get with StepActionType.NEXT three times', fakeAsync(() => {
            joyrideStepService.next();
            tick(1);
            expect(stepsContainerService.get.calls.argsFor(0)).toEqual([StepActionType.NEXT]);
            expect(stepsContainerService.get.calls.argsFor(0)).toEqual([StepActionType.NEXT]);
            expect(stepsContainerService.get.calls.argsFor(0)).toEqual([StepActionType.NEXT]);
        }));
        it('should call backDropService.draw', () => {
            expect(backdropService.draw).toHaveBeenCalledTimes(1);
            expect(backdropService.draw).toHaveBeenCalledWith(STEP1);
        });
    });

    describe('prev()', () => {
        beforeEach(fakeAsync(() => {
            joyrideStepService.startTour();
            tick(1);
        }));
        describe('on the first step', () => {
            beforeEach(() => {
                backdropService.draw.calls.reset();
                joyrideStepService.prev();
            });
        });
        describe('after at least one next() call', () => {
            beforeEach(fakeAsync(() => {
                joyrideStepService.next();
                tick(1);
                backdropService.draw.calls.reset();
                stepsContainerService.get.calls.reset();
                stepDrawerService.remove.calls.reset();
                joyrideStepService.prev();
                tick(1);
            }));
            it('should remove the step calling stepDrawerService.remove', () => {
                expect(stepDrawerService.remove).toHaveBeenCalledTimes(1);
                expect(stepDrawerService.remove).toHaveBeenCalledWith(STEP1);
            });
            it('should call stepsContainerService.get with StepActionType.PREV', () => {
                expect(stepsContainerService.get).toHaveBeenCalledWith(StepActionType.PREV);
            });
            it('should call backDropService.draw', () => {
                expect(backdropService.draw).toHaveBeenCalledTimes(1);
                expect(backdropService.draw).toHaveBeenCalledWith(STEP2);
            });
        });
    });

    describe('when documentService.isElementBeyondOthers returns true once', () => {
        beforeEach(fakeAsync(() => {
            documentService.isElementBeyondOthers.and.returnValues(true, false);
            joyrideStepService.startTour();
            tick(1);
        }));
        it('should call documentService.scrollToTheTop when startTour() is called', () => {
            expect(documentService.scrollToTheTop).toHaveBeenCalled();
            expect(documentService.scrollToTheBottom).not.toHaveBeenCalled();
        });
        it('should call documentService.scrollToTheTop when prev() is called ', fakeAsync(() => {
            joyrideStepService.next();
            tick(1);
            joyrideStepService.prev();
            tick(1);

            expect(documentService.scrollToTheTop).toHaveBeenCalled();
            expect(documentService.scrollToTheBottom).not.toHaveBeenCalled();
        }));
        it('should call documentService.scrollToTheTop when next() is called ', fakeAsync(() => {
            joyrideStepService.next();
            tick(1);

            expect(documentService.scrollToTheTop).toHaveBeenCalled();
            expect(documentService.scrollToTheBottom).not.toHaveBeenCalled();
        }));
    });

    describe('when documentService.isElementBeyondOthers returns true twice', () => {
        beforeEach(fakeAsync(() => {
            documentService.isElementBeyondOthers.and.returnValues(true, true);
            joyrideStepService.startTour();
            tick(1);
        }));
        it('should call both documentService.scrollToTheTop and scrollToTheBottom when startTour() is called ', () => {
            expect(documentService.scrollToTheTop).toHaveBeenCalled();
            expect(documentService.scrollToTheBottom).toHaveBeenCalled();
        });
        it('should scroll both documentService.scrollToTheTop and scrollToTheBottom when prev() is called ', fakeAsync(() => {
            joyrideStepService.next();
            tick(1);
            joyrideStepService.prev();
            tick(1);

            expect(documentService.scrollToTheTop).toHaveBeenCalled();
            expect(documentService.scrollToTheBottom).toHaveBeenCalled();
        }));
        it('should scroll both documentService.scrollToTheTop and scrollToTheBottom when next() is called ', fakeAsync(() => {
            joyrideStepService.next();
            tick(1);

            expect(documentService.scrollToTheTop).toHaveBeenCalled();
            expect(documentService.scrollToTheBottom).toHaveBeenCalled();
        }));
    });

    describe('when documentService.isElementBeyondOthers returns false for three times', () => {
        beforeEach(fakeAsync(() => {
            documentService.isElementBeyondOthers.and.returnValues(false, false, false);
            joyrideStepService.startTour();
            tick(1);
        }));
        it('should NOT call documentService.scroll top, bottom when startTour() is called', () => {
            expect(documentService.scrollToTheTop).not.toHaveBeenCalled();
            expect(documentService.scrollToTheBottom).not.toHaveBeenCalled();
        });
        it('should NOT scroll to 0, 0 when prev() is called ', fakeAsync(() => {
            joyrideStepService.next();
            tick(1);
            joyrideStepService.prev();
            tick(1);

            expect(documentService.scrollToTheTop).not.toHaveBeenCalled();
            expect(documentService.scrollToTheBottom).not.toHaveBeenCalled();
        }));
        it('should NOT scroll to 0, 0 when next() is called ', fakeAsync(() => {
            joyrideStepService.next();
            tick(1);

            expect(documentService.scrollToTheTop).not.toHaveBeenCalled();
            expect(documentService.scrollToTheBottom).not.toHaveBeenCalled();
        }));
    });
});
