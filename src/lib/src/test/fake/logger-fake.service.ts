import { Injectable } from '@angular/core';

@Injectable()
export class LoggerFake {
    debug: jasmine.Spy = jasmine.createSpy("debug");
    info: jasmine.Spy = jasmine.createSpy("info");
    warn: jasmine.Spy = jasmine.createSpy("warn");
    error: jasmine.Spy = jasmine.createSpy("error");
}