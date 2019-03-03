import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class JoyrideStepsContainerServiceFake {
    stepHasBeenModified: Subject<any> = new Subject();
    get: jasmine.Spy = jasmine.createSpy('get');
    getStepNumber: jasmine.Spy = jasmine.createSpy('getStepNumber');
    getStepsCount: jasmine.Spy = jasmine.createSpy('getStepsCount');
    addStep: jasmine.Spy = jasmine.createSpy('addStep');
    updatePosition: jasmine.Spy = jasmine.createSpy('updatePosition');
    init: jasmine.Spy = jasmine.createSpy('init');
    getStepRoute: jasmine.Spy = jasmine.createSpy('getStepRoute');
}
