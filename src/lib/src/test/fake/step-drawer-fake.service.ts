import { Injectable } from '@angular/core';

@Injectable()
export class StepDrawerServiceFake {
    draw: jasmine.Spy = jasmine.createSpy("draw");
    remove: jasmine.Spy = jasmine.createSpy("remove");

}