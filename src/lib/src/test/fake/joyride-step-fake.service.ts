import { Injectable } from "@angular/core";

@Injectable()
export class JoyrideStepFakeService {
    startTour: jasmine.Spy = jasmine.createSpy("startTour");
    close: jasmine.Spy = jasmine.createSpy("close");
    prev: jasmine.Spy = jasmine.createSpy("prev");
    next: jasmine.Spy = jasmine.createSpy("next");
    isFirstStep: jasmine.Spy = jasmine.createSpy("isFirstStep");
    isLastStep: jasmine.Spy = jasmine.createSpy("isLastStep");
}