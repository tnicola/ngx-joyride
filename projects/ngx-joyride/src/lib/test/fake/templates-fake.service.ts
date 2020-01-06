import { Injectable } from "@angular/core";

@Injectable()
export class TemplatesFakeService {
    setPrevButton: jasmine.Spy = jasmine.createSpy('setPrevButton');
    getPrevButton: jasmine.Spy = jasmine.createSpy('getPrevButton');
    setNextButton: jasmine.Spy = jasmine.createSpy('setNextButton');
    getNextButton: jasmine.Spy = jasmine.createSpy('getNextButton');
    setDoneButton: jasmine.Spy = jasmine.createSpy('setDoneButton');
    getDoneButton: jasmine.Spy = jasmine.createSpy('getDoneButton');
    setCounter: jasmine.Spy = jasmine.createSpy('setCounter');
    getCounter: jasmine.Spy = jasmine.createSpy('getCounter');

}