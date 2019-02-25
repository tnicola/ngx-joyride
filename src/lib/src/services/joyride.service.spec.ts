import { TestBed, async, fakeAsync, tick } from "@angular/core/testing";
import { JoyrideService } from "./joyride.service";
import { JoyrideStepService } from "./joyride-step.service";
import { JoyrideStepFakeService } from "../test/fake/joyride-step-fake.service";
import { JoyrideOptionsService } from "./joyride-options.service";
import { JoyrideOptionsServiceFake } from "../test/fake/joyride-options-fake.service";
import { Subject } from "rxjs";
import { JoyrideStepInfo } from "../models/joyride-step-info.class";
import { JoyrideOptions } from "../models/joyride-options.class";

describe('JoyrideService', () => {

    let joyrideStepService: JoyrideStepFakeService;
    let joyrideService: JoyrideService;
    let tourSubject: Subject<JoyrideStepInfo>;
    let optionsService: JoyrideOptionsServiceFake;

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
        optionsService = TestBed.get(JoyrideOptionsService);
        
        tourSubject = new Subject<JoyrideStepInfo>();
        joyrideStepService.startTour.and.returnValue(tourSubject.asObservable());
    });

    describe('when the platformId is not the browser', () => {
        it('should return an empty JoyrideStepInfo', () => {
            const joyrideInfo = new JoyrideStepInfo();
            joyrideService['platformId'] = 'server';

            const returnedValue = joyrideService.startTour();

            expect(returnedValue).toEqual(jasmine.objectContaining(joyrideInfo));
        });
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

        it('should set the options to optionsService', () => {
            const options =  <JoyrideOptions>{ themeColor: '#123456'};
            joyrideService.startTour(options);

            expect(optionsService.setOptions).toHaveBeenCalledWith(options);
        });
    });

    describe('startTour', () => {
        it('should call joyrideStepService.close() if the tour is in progress', () => {
            spyOn(joyrideService, 'isTourInProgress').and.returnValue(true);

            joyrideService.closeTour();

            expect(joyrideStepService.close).toHaveBeenCalled();
        });

        it('should NOT call joyrideStepService.close() if the tour is NOT in progress', () => {
            spyOn(joyrideService, 'isTourInProgress').and.returnValue(false);

            joyrideService.closeTour();

            expect(joyrideStepService.close).not.toHaveBeenCalled();
        });
    })
});