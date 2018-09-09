import { TestBed } from "@angular/core/testing";
import { StepDrawerService } from "./step-drawer.service";
import { ApplicationRef, ComponentFactoryResolver, ViewRef } from "@angular/core";
import { JoyrideStep } from "../models/joyride-step.class";

class ViewRefFake implements ViewRef {

    btn: HTMLElement;
    constructor() {
        this.btn = document.createElement("BUTTON");
        this.btn.setAttribute('name', 'customName');
        this.hostView = { rootNodes: [this.btn] };
        this.instance = { step: {} };
        this.changeDetectorRef = { detectChanges: () => this.detectChanges() }
    }

    instance: any;
    changeDetectorRef: any;
    hostView: any;
    destroyed: boolean;
    destroy: jasmine.Spy = jasmine.createSpy('destroy');
    onDestroy: jasmine.Spy = jasmine.createSpy('onDestroy');
    markForCheck: jasmine.Spy = jasmine.createSpy('markForCheck');
    detach: jasmine.Spy = jasmine.createSpy('detach');
    detectChanges: jasmine.Spy = jasmine.createSpy('detectChanges');
    checkNoChanges: jasmine.Spy = jasmine.createSpy('checkNoChanges');
    reattach: jasmine.Spy = jasmine.createSpy('reattach');
}

export class ComponentFactoryFake {

    viewRef: ViewRefFake;
    constructor(viewRef: ViewRefFake) {
        this.viewRef = viewRef;
    }
    create: jasmine.Spy = jasmine.createSpy('create').and.callFake(() => this.viewRef);
}

export class ComponentFactoryResolverFake implements ComponentFactoryResolver {

    componentFactory: ComponentFactoryFake;

    constructor(viewRef: ViewRefFake) {
        this.componentFactory = new ComponentFactoryFake(viewRef);
    }
    resolveComponentFactory: jasmine.Spy = jasmine.createSpy('resolveComponentFactory').and.callFake(() => this.componentFactory);
}

class ApplicationRefFake {
    componentType: any;
    components: any;
    isStable: any;
    tick: jasmine.Spy = jasmine.createSpy('tick');
    attachView: jasmine.Spy = jasmine.createSpy('attachView');
    detachView: jasmine.Spy = jasmine.createSpy('detachView');
    viewCount: number;


}

describe("StepDrawerService", () => {

    let stepDrawerService: StepDrawerService;
    let appRef: ApplicationRefFake;
    let viewRef = new ViewRefFake();
    let componentFactoryResolver: ComponentFactoryResolverFake = new ComponentFactoryResolverFake(viewRef);
    let STEP: JoyrideStep = new JoyrideStep();


    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                StepDrawerService,
                { provide: ComponentFactoryResolver, useValue: componentFactoryResolver },
                { provide: ApplicationRef, useClass: ApplicationRefFake }
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        stepDrawerService = TestBed.get(StepDrawerService);
        appRef = TestBed.get(ApplicationRef);
    });

    describe('draw', () => {

        it('should call applicationRef.attachView', () => {
            stepDrawerService.draw(STEP);

            expect(appRef.attachView).toHaveBeenCalledTimes(1);
        });

        it('should set step.stepInstance with the step instance', () => {
            STEP.name = 'myStep';
            stepDrawerService.draw(STEP);

            expect(STEP.stepInstance.step.name).toEqual('myStep');
        });

    });
    describe('remove', () => {
        it('should call applicationRef.detachView', () => {
            stepDrawerService.draw(STEP);
            stepDrawerService.remove(STEP);

            expect(appRef.detachView).toHaveBeenCalledTimes(1);
        });
    });
});