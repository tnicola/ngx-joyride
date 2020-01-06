import { Injectable } from '@angular/core';

@Injectable()
export class RouterFake {
    navigate: jasmine.Spy = jasmine.createSpy("navigate");
    url: string = "/";
}