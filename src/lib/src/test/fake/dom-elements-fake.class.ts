import { ElementRef, ViewContainerRef } from "@angular/core";

export class FakeElementRef implements ElementRef {
    nativeElement: any;
    constructor() {
        this.nativeElement = {
            offsetHeight: 34,
            getBoundingClientRect: () => { return { width: 10, height: 15 } }
        };
    }

}

export class FakeViewContainerRef implements ViewContainerRef {
    element: ElementRef<any>;
    injector: any;
    parentInjector: any;
    move: jasmine.Spy = jasmine.createSpy("move");
    clear: jasmine.Spy = jasmine.createSpy("clear");
    insert: jasmine.Spy = jasmine.createSpy("insert");
    get: jasmine.Spy = jasmine.createSpy("get");
    createEmbeddedView: jasmine.Spy = jasmine.createSpy("createEmbeddedView");
    createComponent: jasmine.Spy = jasmine.createSpy("createComponent");
    length: number;
    remove: jasmine.Spy = jasmine.createSpy("remove");
    indexOf: jasmine.Spy = jasmine.createSpy("indexOf");
    detach: jasmine.Spy = jasmine.createSpy("detach");
    constructor(elemRef: FakeElementRef) {
        this.element = elemRef;
    }

}
