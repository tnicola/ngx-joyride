import { JoyrideStepService } from './joyride-step.service';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
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
import { EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { RouterFake } from '../test/fake/router-fake.service';
import { JoyrideStepsContainerServiceFake } from '../test/fake/joyride-steps-container-fake.service';

describe("JoyrideStepService", () => {

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
    let FAKE_WINDOW: any;

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
        FAKE_WINDOW = { innerHeight: 200, scrollTo: jasmine.createSpy("scrollTo") }
        domRefService.getNativeWindow.and.returnValue(FAKE_WINDOW);

        joyrideStepService = TestBed.get(JoyrideStepService);
        eventListenerService = TestBed.get(EventListenerService);
        backdropService = TestBed.get(JoyrideBackdropService);
        documentService = TestBed.get(DocumentService);
        stepsContainerService = TestBed.get(JoyrideStepsContainerService);
        stepDrawerService = TestBed.get(StepDrawerService);

        STEP0 = createNewStep("nav");
        STEP1 = createNewStep("credits");
        STEP2 = createNewStep("");

        FAKE_STEPS = [STEP0, STEP1, STEP2];
        stepsContainerService.get.and.callFake((index: any) => { return FAKE_STEPS[index] })

    });

    function createNewStep(nextStepName: string = "") {
        let step: any  = new JoyrideStep();
        let stepTargetViewContainer =  { element: "", remove: jasmine.createSpy("remove") };
        step.targetViewContainer = stepTargetViewContainer;
        step.prevCliked = new EventEmitter();
        step.nextClicked = new EventEmitter();
        step.tourDone = new EventEmitter();
        step.nextStepName = nextStepName;

        return step;
    }

    describe("At the beginning", () => {
        it("should start listening to scroll events", () => {
            expect(eventListenerService.startListeningScrollEvents).toHaveBeenCalledTimes(1);
        })
    });

    describe("when eventListener.scrollEvent publish", () => {
        it("should call backdropService.redraw with the right 'scroll' parameter", () => {
            eventListenerService.scrollEvent.next(240);

            expect(backdropService.redraw).toHaveBeenCalledWith(undefined, 240);
        })
    })

    describe("when eventListener.resizeEvent publish", () => {
        it("should call backdropService.redrawTarget", fakeAsync(() => {
            joyrideStepService.startTour();
            tick(1); //wait for the first step
            eventListenerService.resizeEvent.next();

            expect(backdropService.redrawTarget).toHaveBeenCalled();
        }));
    })

    describe("close()", () => {
        beforeEach(fakeAsync(() => {
            joyrideStepService.startTour();
            tick(1);
            joyrideStepService.close();
        }));
        it("should call backDropService.remove", () => {
            expect(backdropService.remove).toHaveBeenCalled();
        })
        it("should remove the step calling stepDrawerService.remove", () => {
            expect(stepDrawerService.remove).toHaveBeenCalledTimes(1);
            expect(stepDrawerService.remove).toHaveBeenCalledWith(STEP0);
        });
        it("should scroll to 0, 0", () => {
            expect(FAKE_WINDOW.scrollTo).toHaveBeenCalledWith(0, 0);
        });
        it("should call eventListener.stopListeningResizeEvents", () => {
            expect(eventListenerService.stopListeningResizeEvents).toHaveBeenCalledTimes(1);
        })
    })

    describe("startTour()", () => {
        beforeEach(fakeAsync(() => {
            joyrideStepService.startTour();
            tick(1);
        }));
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
        beforeEach(fakeAsync(() => {
            joyrideStepService.startTour();
            tick(1);
            backdropService.draw.calls.reset();
            joyrideStepService.next();
            tick(1);
        }));
        it("should remove the step calling stepDrawerService.remove", () => {
            expect(stepDrawerService.remove).toHaveBeenCalledTimes(1);
            expect(stepDrawerService.remove).toHaveBeenCalledWith(STEP0);
        });
        it("should call stepsContainerService.get with index of the current step + 1", () => {
            expect(stepsContainerService.get).toHaveBeenCalledWith(1);
        });
        it("should call stepsContainerService.get with index of the current step + 2, the second time", fakeAsync(() => {
            joyrideStepService.next();
            tick(1);
            expect(stepsContainerService.get).toHaveBeenCalledWith(2);
        }));
        it("should call backDropService.draw", () => {
            expect(backdropService.draw).toHaveBeenCalledTimes(1)
            expect(backdropService.draw).toHaveBeenCalledWith(STEP1);
        });

    });
    describe("prev()", () => {
        beforeEach(fakeAsync(() => {
            joyrideStepService.startTour();
            tick(1);
        }));
        describe("on the first step", () => {
            beforeEach(() => {
                backdropService.draw.calls.reset();
                joyrideStepService.prev();
            });
        });
        describe("after at least one next() call", () => {
            beforeEach(fakeAsync(() => {
                joyrideStepService.next();
                tick(1);
                backdropService.draw.calls.reset();
                stepsContainerService.get.calls.reset();
                stepDrawerService.remove.calls.reset();
                joyrideStepService.prev();
                tick(1);
            }));
            it("should remove the step calling stepDrawerService.remove", () => {
                expect(stepDrawerService.remove).toHaveBeenCalledTimes(1);
                expect(stepDrawerService.remove).toHaveBeenCalledWith(STEP1);

            });
            it("should call stepsContainerService.get with index of the current step - 1", () => {
                expect(stepsContainerService.get).toHaveBeenCalledWith(0);
            });
            xit("should call stepsContainerService.get with index of the current step - 2, the second time", fakeAsync(() => {
                joyrideStepService.prev();
                tick(1);
                expect(stepsContainerService.get).toHaveBeenCalledWith(-1);
            }));
            it("should call backDropService.draw", () => {
                expect(backdropService.draw).toHaveBeenCalledTimes(1)
                expect(backdropService.draw).toHaveBeenCalledWith(STEP0);
            })
        })
    });
    describe("isFirstStep", () => {
        beforeEach(fakeAsync(() => {
            joyrideStepService.startTour();
            tick(1);
        }));
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
        beforeEach(fakeAsync(() => {
            joyrideStepService.startTour();
            tick(1);
        }));
        it("should return false if it's the first step", () => {
            expect(joyrideStepService.isLastStep()).toBe(false);
        })
        it("should not return true if it's the second step", () => {
            joyrideStepService.next();
            expect(joyrideStepService.isLastStep()).toBe(false);
        })
        it("should return true if it's the last step", fakeAsync(() => {
            stepsContainerService.getNumberOfSteps.and.returnValue(3);
            joyrideStepService.next();
            joyrideStepService.next();
            tick(2);
            expect(joyrideStepService.isLastStep()).toBe(true);
        }));
    });
});