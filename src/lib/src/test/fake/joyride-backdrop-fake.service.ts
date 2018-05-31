import { Injectable } from "@angular/core";

@Injectable()
export class JoyrideBackdropServiceFake {
    show: jasmine.Spy = jasmine.createSpy("show");
    hide: jasmine.Spy = jasmine.createSpy("hide");
    redrawTarget: jasmine.Spy = jasmine.createSpy("redrawTarget");
    redraw: jasmine.Spy = jasmine.createSpy("redraw");
}