import { Injectable } from '@angular/core';

@Injectable()
export class JoyrideServiceFake {

    startTour: jasmine.Spy = jasmine.createSpy("startTour");

}