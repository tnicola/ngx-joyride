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
    let STEP0: any = new JoyrideStep();
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
        FAKE_WINDOW = { innerHeight: 200, scrollTo: (x, y) => { } }
        domRefService.getNativeWindow.and.returnValue(FAKE_WINDOW);

        joyrideStepService = TestBed.get(JoyrideStepService);
        eventListenerService = TestBed.get(EventListenerService);
        backdropService = TestBed.get(JoyrideBackdropService);
        documentService = TestBed.get(DocumentService);
        stepsContainerService = TestBed.get(JoyrideStepsContainerService);
        
        STEP0.targetViewContainer = { element: null, remove: () => { } };
        
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
            stepsContainerService.get.and.returnValue(STEP0);
            joyrideStepService.startTour();
            eventListenerService.resizeEvent.next();

            expect(backdropService.redrawTarget).toHaveBeenCalled();
        })
    })

    describe("close()", () => {
        beforeEach(() => {
            stepsContainerService.get.and.returnValue(STEP0);
            joyrideStepService.startTour();
            joyrideStepService.close();
        });
        it("should call backDropService.hide", () => {
            expect(backdropService.hide).toHaveBeenCalled();
        })
    })

    describe("startTour()", () => {
        beforeEach(() => {
            stepsContainerService.get.and.returnValue(STEP0);
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

});