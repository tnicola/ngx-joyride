import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()
export class EventListenerServiceFake {

    scrollEvent: Subject<any> = new Subject();
    resizeEvent: Subject<any> = new Subject();
    startListeningScrollEvents: jasmine.Spy = jasmine.createSpy("startListeningScrollEvents");
    startListeningResizeEvents: jasmine.Spy = jasmine.createSpy("startListeningResizeEvents");
    stopListeningScrollEvents: jasmine.Spy = jasmine.createSpy("stopListeningScrollEvents");
    stopListeningResizeEvents: jasmine.Spy = jasmine.createSpy("stopListeningResizeEvents");

}