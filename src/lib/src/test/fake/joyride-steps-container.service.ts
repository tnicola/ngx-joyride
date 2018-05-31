import { Injectable } from "@angular/core";
import { Subject } from "rxjs/Subject";

@Injectable()
export class JoyrideStepsContainerServiceFake {

    stepHasBeenModified: Subject<any> = new Subject();
    get: jasmine.Spy = jasmine.createSpy("get");
    getStepPosition: jasmine.Spy = jasmine.createSpy("getStepPosition");
    addStep: jasmine.Spy = jasmine.createSpy("addStep");
    getNumberOfSteps: jasmine.Spy = jasmine.createSpy("getNumberOfSteps");
    setPosition: jasmine.Spy = jasmine.createSpy("setPosition");
    initSteps: jasmine.Spy = jasmine.createSpy("initSteps");

}