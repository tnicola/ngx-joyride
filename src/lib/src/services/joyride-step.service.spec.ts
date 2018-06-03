import { JoyrideStepService } from './joyride-step.service';
import { TestBed } from '@angular/core/testing';
import { JoyrideStepsContainerServiceFake } from '../test/fake/joyride-steps-container.service';
import { JoyrideStepFakeService } from '../test/fake/joyride-step-fake.service';
import { JoyrideBackdropService } from './joyride-backdrop.service';
import { EventListenerServiceFake } from '../test/fake/event-listener-fake.service';
import { EventListenerService } from './event-listener.service';
import { DocumentServiceFake } from '../test/fake/document-fake.service';
import { DomRefServiceFake } from '../test/fake/dom-fake.service';
import { StepDrawerServiceFake } from '../test/fake/step-drawer-fake.service';
import { JoyrideStepsContainerService } from './joyride-steps-container.service';
import { DocumentService } from './document.service';
import { DomRefService } from './dom.service';
import { StepDrawerService } from './step-drawer.service';
import { JoyrideOptionsService } from './joyride-options.service';
import { JoyrideOptionsServiceFake } from '../test/fake/joyride-options-fake.service';
import { JoyrideBackdropServiceFake } from '../test/fake/joyride-backdrop-fake.service';
import { JoyrideStep } from '../models/joyride-step.class';
import { ViewContainerRef } from '@angular/core';

describe("JoyrideStepService", () => {

    let joyrideStepService: JoyrideStepService;
    let eventListenerService: EventListenerServiceFake;
    let backdropService: JoyrideBackdropServiceFake;
    let documentService: DocumentServiceFake;
    let stepsContainerService: JoyrideStepsContainerServiceFake;
    let domRefService: DomRefServiceFake;
    let step0TargetViewContainer, step1TargetViewContainer, step2TargetViewContainer;
    let FAKE_STEPS = [];
    let STEP0: any = new JoyrideStep();
    let STEP1: any = new JoyrideStep();
    let STEP2: any = new JoyrideStep();
    let FAKE_WINDOW: any;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                JoyrideStepService,
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
        FAKE_WINDOW = { innerHeight: 200, scrollTo: jasmine.createSpy("scrollTo") }
        domRefService.getNativeWindow.and.returnValue(FAKE_WINDOW);

        joyrideStepService = TestBed.get(JoyrideStepService);
        eventListenerService = TestBed.get(EventListenerService);
        backdropService = TestBed.get(JoyrideBackdropService);
        documentService = TestBed.get(DocumentService);
        stepsContainerService = TestBed.get(JoyrideStepsContainerService);

        step0TargetViewContainer = { element: null, remove: jasmine.createSpy("remove") };
        STEP0.targetViewContainer = step0TargetViewContainer;
        STEP0.idSelector = 'step0';
        step1TargetViewContainer = { element: null, remove: jasmine.createSpy("remove") };
        STEP1.targetViewContainer = step1TargetViewContainer;
        STEP1.idSelector = 'step1';
        step2TargetViewContainer = { element: null, remove: jasmine.createSpy("remove") };
        STEP2.targetViewContainer = step2TargetViewContainer;

        FAKE_STEPS = [STEP0, STEP1, STEP2];
        stepsContainerService.get.and.callFake((index) => { return FAKE_STEPS[index] })

    });

    describe("At the beginning", () => {
        it("should start listening to scroll events", () => {
            expect(eventListenerService.startListeningScrollEvents).toHaveBeenCalledTimes(1);
        })
    });

    describe("when eventListener.scrollEvent publish", () => {
        it("should call backdropService.redraw with the right 'scroll' parameter", () => {
            eventListenerService.scrollEvent.next(240);

            expect(backdropService.redraw).toHaveBeenCalledWith(240);
        })
    })

    describe("when eventListener.resizeEvent publish", () => {
        it("should call backdropService.redrawTarget", () => {
            joyrideStepService.startTour();
            eventListenerService.resizeEvent.next();

            expect(backdropService.redrawTarget).toHaveBeenCalled();
        })
    })

    describe("close()", () => {
        beforeEach(() => {
            joyrideStepService.startTour();
            joyrideStepService.close();
        });
        it("should call backDropService.hide", () => {
            expect(backdropService.hide).toHaveBeenCalled();
        })
        it("should remove the step", () => {
            expect(step0TargetViewContainer.remove).toHaveBeenCalledTimes(1);
        });
        it("should scroll to 0, 0", () => {
            expect(FAKE_WINDOW.scrollTo).toHaveBeenCalledWith(0, 0);
        });
        it("should call eventListener.stopListeningResizeEvents", () => {
            expect(eventListenerService.stopListeningResizeEvents).toHaveBeenCalledTimes(1);
        })
    })

    describe("startTour()", () => {
        beforeEach(() => {
            joyrideStepService.startTour();
        });
        it("should call documentService.setDocumentHeight", () => {
            expect(documentService.setDocumentHeight).toHaveBeenCalled();
        });
        it("should call stepsContainerService.initSteps", () => {
            expect(stepsContainerService.initSteps).toHaveBeenCalled();
        });
        it("should call stepsContainerService.get with 0, the first step index", () => {
            expect(stepsContainerService.get).toHaveBeenCalledWith(0);
        });
    });

    describe("next", () => {
        beforeEach(() => {
            joyrideStepService.startTour();
            backdropService.show.calls.reset();
            joyrideStepService.next();
        });
        it("should call backDropService.hide", () => {
            expect(backdropService.hide).toHaveBeenCalled();
        })
        it("should remove the step", () => {
            expect(step0TargetViewContainer.remove).toHaveBeenCalledTimes(1);
        });
        it("should call stepsContainerService.get with index of the current step + 1", () => {
            expect(stepsContainerService.get).toHaveBeenCalledWith(1);
        });
        it("should call stepsContainerService.get with index of the current step + 2, the second time", () => {
            joyrideStepService.next();
            expect(stepsContainerService.get).toHaveBeenCalledWith(2);
        });
        it("should call backDropService.show", () => {
            expect(backdropService.show).toHaveBeenCalledTimes(1)
            expect(backdropService.show).toHaveBeenCalledWith(step1TargetViewContainer, 'step1');
        })

    });
    describe("prev()", () => {
        beforeEach(() => {
            joyrideStepService.startTour();
        });
        describe("on the first step", () => {
            beforeEach(() => {
                backdropService.show.calls.reset();
                joyrideStepService.prev();
            });
        });
        describe("after at least one next() call", () => {
            beforeEach(() => {
                joyrideStepService.next();
                backdropService.show.calls.reset();
                stepsContainerService.get.calls.reset();
                joyrideStepService.prev();
            });
            it("should call backDropService.hide", () => {
                expect(backdropService.hide).toHaveBeenCalled();
            })
            it("should remove the step", () => {
                expect(step0TargetViewContainer.remove).toHaveBeenCalledTimes(1);
            });
            it("should call stepsContainerService.get with index of the current step - 1", () => {
                expect(stepsContainerService.get).toHaveBeenCalledWith(0);
            });
            xit("should call stepsContainerService.get with index of the current step - 2, the second time", () => {
                joyrideStepService.prev();
                expect(stepsContainerService.get).toHaveBeenCalledWith(-1);
            });
            it("should call backDropService.show", () => {
                expect(backdropService.show).toHaveBeenCalledTimes(1)
                expect(backdropService.show).toHaveBeenCalledWith(step0TargetViewContainer, 'step0');
            })
        })
    });
    describe("isFirstStep", () => {
        beforeEach(() => {
           joyrideStepService.startTour();
        })
        it("should return true if it's the first step", () => {
            expect(joyrideStepService.isFirstStep()).toBe(true);
        })
        it("should return false if it's the second step", () => {
            joyrideStepService.next();
            expect(joyrideStepService.isFirstStep()).toBe(false);
        })
        it("should return false if it's the last step", () => {
            joyrideStepService.next();
            joyrideStepService.next();
            expect(joyrideStepService.isFirstStep()).toBe(false);
        })
    });
    describe("isLastStep", () => {
        beforeEach(() => {
            joyrideStepService.startTour();
         })
        it("should return true if it's the first step", () => {
            expect(joyrideStepService.isLastStep()).toBe(false);
        })
        it("should not return true if it's the second step", () => {
            joyrideStepService.next();
            expect(joyrideStepService.isLastStep()).toBe(false);
        })
        it("should return true if it's the last step", () => {
            stepsContainerService.getNumberOfSteps.and.returnValue(3);
            joyrideStepService.next();
            joyrideStepService.next();
            expect(joyrideStepService.isLastStep()).toBe(true);
        })
    });
});