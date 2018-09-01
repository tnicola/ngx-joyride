import { Injectable } from "@angular/core";
import { IJoyrideStepService } from "../../services/joyride-step.service"

@Injectable()
export class JoyrideStepFakeService implements IJoyrideStepService {
    startTour: jasmine.Spy = jasmine.createSpy("startTour");
    close: jasmine.Spy = jasmine.createSpy("close");
    prev: jasmine.Spy = jasmine.createSpy("prev");
    next: jasmine.Spy = jasmine.createSpy("next");
    isFirstStep: jasmine.Spy = jasmine.createSpy("isFirstStep");
    isLastStep: jasmine.Spy = jasmine.createSpy("isLastStep");
}