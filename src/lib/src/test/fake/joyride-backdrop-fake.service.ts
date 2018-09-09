import { Injectable } from "@angular/core";

@Injectable()
export class JoyrideBackdropServiceFake {
    draw: jasmine.Spy = jasmine.createSpy("draw");
    remove: jasmine.Spy = jasmine.createSpy("remove");
    redrawTarget: jasmine.Spy = jasmine.createSpy("redrawTarget");
    redraw: jasmine.Spy = jasmine.createSpy("redraw");
}