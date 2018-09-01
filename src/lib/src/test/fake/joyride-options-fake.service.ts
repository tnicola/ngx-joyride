import { Injectable } from "@angular/core";

@Injectable()
export class JoyrideOptionsServiceFake {
    setOptions: jasmine.Spy = jasmine.createSpy("setOptions");
    getBackdropColor: jasmine.Spy = jasmine.createSpy("getBackdropColor");
    getThemeColor: jasmine.Spy = jasmine.createSpy("getThemeColor");
    getStepDefaultPosition: jasmine.Spy = jasmine.createSpy("getStepDefaultPosition");
    areLogsEnabled: jasmine.Spy = jasmine.createSpy("areLogsEnabled");
    isCounterVisible: jasmine.Spy = jasmine.createSpy("isCounterVisible");
    isPrevButtonVisible: jasmine.Spy = jasmine.createSpy("isPrevButtonVisible");
    getFirstStepRoute: jasmine.Spy = jasmine.createSpy("getFirstStepRoute");
    getStepsOrder: jasmine.Spy = jasmine.createSpy("getStepsOrder");
}