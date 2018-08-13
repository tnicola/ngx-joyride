import { TestBed, async, fakeAsync, tick } from "@angular/core/testing";
import { JoyrideService } from "./joyride.service";
import { JoyrideStepService } from "./joyride-step.service";
import { JoyrideStepFakeService } from "../test/fake/joyride-step-fake.service";
import { JoyrideOptionsService } from "./joyride-options.service";
import { JoyrideOptionsServiceFake } from "../test/fake/joyride-options-fake.service";
import { Subject } from "rxjs";
import { JoyrideStepInfo } from "../models/joyride-step-info.class";

describe('JoyrideService', () => {

    let joyrideStepService: JoyrideStepFakeService;
    let joyrideService: JoyrideService;
    let tourSubject: Subject<JoyrideStepInfo>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [],
            providers: [
                JoyrideService,
                { provide: JoyrideStepService, useClass: JoyrideStepFakeService },
                { provide: JoyrideOptionsService, useClass: JoyrideOptionsServiceFake }
            ]
        });
    });

    beforeEach(() => {
        joyrideService = TestBed.get(JoyrideService);
        joyrideStepService = TestBed.get(JoyrideStepService);
        
        tourSubject = new Subject<JoyrideStepInfo>();
        joyrideStepService.startTour.and.returnValue(tourSubject.asObservable());
    });

    describe('isTourInProgress', () => {

        it('should return false at the beginning', () => {
            expect(joyrideService.isTourInProgress()).toBe(false);
        });

        it('should return true if startTour is called once, 1 event arrives and no complete events arrive', () => {
            joyrideService.startTour();
            tourSubject.next(new JoyrideStepInfo());

            expect(joyrideService.isTourInProgress()).toBe(true);
        });

        it('should return true if startTour is called once, 2 events arrive and no complete events arrive', () => {
            joyrideService.startTour();
            tourSubject.next(new JoyrideStepInfo());
            tourSubject.next(new JoyrideStepInfo());

            expect(joyrideService.isTourInProgress()).toBe(true);
        });

        it('should return false if a completion event arrives', () => {
            joyrideService.startTour();
            tourSubject.next(new JoyrideStepInfo());
            tourSubject.next(new JoyrideStepInfo());
            tourSubject.complete();

            expect(joyrideService.isTourInProgress()).toBe(false);
        });

    });
    describe('startTour', () => {

        it('should call joyrideStepService.startTour() the first time', () => {
            joyrideService.startTour();
            expect(joyrideStepService.startTour).toHaveBeenCalledTimes(1);
        });

        it('should NOT call joyrideStepService.startTour() the second time, if no completion events arrive', () => {
            joyrideService.startTour();
            tourSubject.next(new JoyrideStepInfo());
            joyrideService.startTour();
            joyrideService.startTour();

            expect(joyrideStepService.startTour).toHaveBeenCalledTimes(1);
        });
    })
});