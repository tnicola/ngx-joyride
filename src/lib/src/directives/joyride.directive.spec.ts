import { TestBed, ComponentFixture } from '@angular/core/testing';
import { JoyrideDirective } from './joyride.directive';
import { JoyrideStepsContainerService } from '../services/joyride-steps-container.service';
import { JoyrideStepsContainerServiceFake } from '../test/fake/joyride-steps-container-fake.service';
import {
    Component,
    DebugElement,
    TemplateRef,
    ViewContainerRef,
    SimpleChange,
    SimpleChanges
} from '@angular/core';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterFake } from '../test/fake/router-fake.service';
import { JoyrideError } from '../models/joyride-error.class';
import { JoyrideStep } from '../models/joyride-step.class';
import { DomRefService } from '../services/dom.service';
import { DomRefServiceFake } from '../test/fake/dom-fake.service';
import { TemplatesService } from '../services/templates.service';
import { TemplatesFakeService } from '../test/fake/templates-fake.service';

@Component({
    selector: 'cmp',
    template: `
        <div style="position: fixed">
            <div>
                <div
                    style="transform: translateX(-50px)"
                    joyrideStep="myStep"
                    title="Title"
                    (prev)="onPrev()"
                    (next)="onNext()"
                    (done)="onDone()"
                >
                    Test
                </div>
            </div>
        </div>
    `
})
class HostComponent {
    onPrev: jasmine.Spy = jasmine.createSpy('onPrev');
    onNext: jasmine.Spy = jasmine.createSpy('onNext');
    onDone: jasmine.Spy = jasmine.createSpy('onDone');
}

@Component({
    selector: 'cmp-fixed',
    template: `
        <div style="position: fixed" joyrideStep="myStep" title="Title">Test</div>
    `
})
class HostComponentFixed {}

@Component({
    selector: 'cmp-fixed',
    template: `
        <div joyrideStep="myStep" title="Title">Test</div>
    `
})
class HostComponentNotFixed {}

describe('JorideDirective', () => {
    let stepContainerService: JoyrideStepsContainerServiceFake;
    let fixture: ComponentFixture<any>;
    let hostComponent: HostComponent;
    let joyDirectiveDebugElement: DebugElement;
    let joyDirective: JoyrideDirective;
    let routerService: RouterFake;
    let templatesService: TemplatesFakeService;
    let domRefService: DomRefServiceFake;
    let FAKE_WINDOW: any = {
        getComputedStyle: () => {
            return { transform: 'transform', position: 'absolute' };
        }
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [JoyrideDirective, HostComponent, HostComponentFixed, HostComponentNotFixed],
            providers: [
                { provide: DomRefService, useClass: DomRefServiceFake },
                { provide: JoyrideStepsContainerService, useClass: JoyrideStepsContainerServiceFake },
                { provide: Router, useClass: RouterFake },
                { provide: TemplatesService, useClass: TemplatesFakeService }
            ]
        }).compileComponents();
    });

    function initDirective() {
        joyDirectiveDebugElement = fixture.debugElement.query(By.directive(JoyrideDirective));
        joyDirective = joyDirectiveDebugElement.injector.get(JoyrideDirective) as JoyrideDirective;
        stepContainerService = TestBed.get(JoyrideStepsContainerService);
        routerService = TestBed.get(Router);
        domRefService = TestBed.get(DomRefService);
        domRefService.getNativeWindow.and.returnValue(FAKE_WINDOW);
    }

    beforeEach(() => {
        fixture = TestBed.createComponent(HostComponent);
        hostComponent = fixture.componentInstance;
        templatesService = TestBed.get(TemplatesService);
        initDirective();
    });

    describe('ngAfterViewInit', () => {
        it('should add the step to the stepContainerService', () => {
            fixture.detectChanges();

            expect(stepContainerService.addStep).toHaveBeenCalledTimes(1);
        });

        it("should set the route without / if the router.url doesn't end up with /", () => {
            routerService.url = '/my/route';

            fixture.detectChanges();
            let stepAdded: JoyrideStep = stepContainerService.addStep.calls.argsFor(0)[0];

            expect(stepAdded.route).toBe('my/route');
        });

        it('should set the entire router.url if the router.url ends up with / ', () => {
            routerService.url = 'my/great/url/';

            fixture.detectChanges();
            let stepAdded: JoyrideStep = stepContainerService.addStep.calls.argsFor(0)[0];

            expect(stepAdded.route).toBe('my/great/url/');
        });

        it("should set the route to empty if it's on the root route", () => {
            routerService.url = '/';

            fixture.detectChanges();
            let stepAdded: JoyrideStep = stepContainerService.addStep.calls.argsFor(0)[0];

            expect(stepAdded.route).toBe('');
        });

        it('should set transformCssStyle if the transform css property is set on the target element', () => {
            fixture.detectChanges();
            let stepAdded: JoyrideStep = stepContainerService.addStep.calls.argsFor(0)[0];

            expect(stepAdded.transformCssStyle).toBe('matrix(1, 0, 0, 1, -50, 0)');
        });

        it('should set isElementOrAncestorFixed to true if an ancestor has position:fixed', () => {
            fixture.detectChanges();
            let stepAdded: JoyrideStep = stepContainerService.addStep.calls.argsFor(0)[0];

            expect(stepAdded.isElementOrAncestorFixed).toBe(true);
        });

        it('should set isElementOrAncestorFixed to true if the target has position:fixed', () => {
            let winWithTargetFixed: any = {
                getComputedStyle: () => {
                    return { transform: 'transform', position: 'fixed' };
                }
            };
            joyDirective['windowRef'] = winWithTargetFixed;
            joyDirective.name = 'Name';
            joyDirective.ngAfterViewInit();
            let stepAdded: JoyrideStep = stepContainerService.addStep.calls.argsFor(0)[0];

            expect(stepAdded.isElementOrAncestorFixed).toBe(true);
        });

        it('should set isElementOrAncestorFixed to false if the target and its ancestors haven\t position:fixed', () => {
            fixture = TestBed.createComponent(HostComponentNotFixed);
            initDirective();
            fixture.detectChanges();
            let stepAdded: JoyrideStep = stepContainerService.addStep.calls.argsFor(0)[0];

            expect(stepAdded.isElementOrAncestorFixed).toBe(false);
        });

        it('should call onPrev() if the step.prev emits', () => {
            fixture.detectChanges();
            let stepAdded: JoyrideStep = stepContainerService.addStep.calls.argsFor(0)[0];
            stepAdded.prevCliked.emit();

            expect(hostComponent.onPrev).toHaveBeenCalledTimes(1);
        });

        it('should call onNext() if the step.next emits', () => {
            fixture.detectChanges();
            let stepAdded: JoyrideStep = stepContainerService.addStep.calls.argsFor(0)[0];
            stepAdded.nextClicked.emit();

            expect(hostComponent.onNext).toHaveBeenCalledTimes(1);
        });

        it('should call onDone() if the step.prev emits', () => {
            fixture.detectChanges();
            let stepAdded: JoyrideStep = stepContainerService.addStep.calls.argsFor(0)[0];
            stepAdded.tourDone.emit();

            expect(hostComponent.onDone).toHaveBeenCalledTimes(1);
        });

        describe('when the platform is server', () => {
            beforeEach(() => {
                joyDirective['platformId'] = 'server';
            });

            it('should do nothing', () => {
                expect(() => joyDirective.ngAfterViewInit()).not.toThrow();
            });
        });

        describe('when the platform is browser', () => {
            beforeEach(() => {
                joyDirective['platformId'] = 'browser';
            });

            it('should throw a JoyrideError if the step name is not defined', () => {
                expect(() => joyDirective.ngAfterViewInit()).toThrowError(
                    "All the steps should have the 'joyrideStep' property set with a custom name."
                );
            });

            it('should NOT throw a JoyrideError if the step name is defined', () => {
                joyDirective.name = 'pippo';

                expect(() => joyDirective.ngAfterViewInit()).not.toThrow();
            });

            it('should set the prev template if it is defined', () => {
                joyDirective.name = 'pippo';
                joyDirective.prevTemplate = <TemplateRef<any>>{};

                joyDirective.ngAfterViewInit();

                expect(templatesService.setPrevButton).toHaveBeenCalled();
            });

            it('should set the next template if it is defined', () => {
                joyDirective.name = 'pippo';
                joyDirective.nextTemplate = <TemplateRef<any>>{};

                joyDirective.ngAfterViewInit();

                expect(templatesService.setNextButton).toHaveBeenCalled();
            });

            it('should set the done template if it is defined', () => {
                joyDirective.name = 'pippo';
                joyDirective.doneTemplate = <TemplateRef<any>>{};

                joyDirective.ngAfterViewInit();

                expect(templatesService.setDoneButton).toHaveBeenCalled();
            });

            it('should set the counter template if it is defined', () => {
                joyDirective.name = 'pippo';
                joyDirective.counterTemplate = <TemplateRef<any>>{};

                joyDirective.ngAfterViewInit();

                expect(templatesService.setCounter).toHaveBeenCalled();
            });

            it('should not set the templates if they are undefined', () => {
                joyDirective.name = 'pippo';
                joyDirective.prevTemplate = undefined;
                joyDirective.prevTemplate = undefined;
                joyDirective.prevTemplate = undefined;
                joyDirective.prevTemplate = undefined;

                joyDirective.ngAfterViewInit();

                expect(templatesService.setPrevButton).not.toHaveBeenCalled();
                expect(templatesService.setNextButton).not.toHaveBeenCalled();
                expect(templatesService.setDoneButton).not.toHaveBeenCalled();
                expect(templatesService.setCounter).not.toHaveBeenCalled();
            });
        });

        it("should add a step with isElementOrAncestorFixed if the element is not fixed and it doesn't have a parent", () => {
            joyDirective.name = 'title';
            joyDirective['viewContainerRef'] = <ViewContainerRef>{
                element: {
                    nativeElement: {
                        parentElement: null
                    }
                },
                injector: {},
                parentInjector: {},
                length: 2,
                clear: undefined,
                get: undefined,
                createEmbeddedView: undefined,
                createComponent: undefined,
                insert: undefined,
                move: undefined,
                indexOf: undefined,
                remove: undefined,
                detach: undefined
            };
            joyDirective['windowRef'] = FAKE_WINDOW;
            joyDirective.ngAfterViewInit();

            expect(stepContainerService.addStep.calls.first().args[0].isElementOrAncestorFixed).toBe(false);
        });
    });

    describe('ngOnChanges', () => {
        it('should emit with current changes when title changes', () => {
            const emitTitleSpy = spyOn(joyDirective['step']['title'], 'next');
            const emitTextSpy = spyOn(joyDirective['step']['text'], 'next');
            const changes = <SimpleChanges>{ title: <SimpleChange>{ previousValue: 'old', currentValue: 'new' } };

            joyDirective.title = 'NewTitle';
            joyDirective.ngOnChanges(changes);

            expect(emitTitleSpy).toHaveBeenCalledWith('NewTitle');
            expect(emitTextSpy).toHaveBeenCalledWith(undefined);
        });

        it('should emit with current changes when text changes', () => {
            const emitTitleSpy = spyOn(joyDirective['step']['title'], 'next');
            const emitTextSpy = spyOn(joyDirective['step']['text'], 'next');
            const changes = <SimpleChanges>{ text: <SimpleChange>{ previousValue: 'old', currentValue: 'new' } };

            joyDirective.text = 'NewText';
            joyDirective.ngOnChanges(changes);

            expect(emitTextSpy).toHaveBeenCalledWith('NewText');
            expect(emitTitleSpy).toHaveBeenCalledWith(undefined);
        });

        it('should NOT emit when neither text nor title changes', () => {
            const emitTitleSpy = spyOn(joyDirective['step']['title'], 'next');
            const emitTextSpy = spyOn(joyDirective['step']['text'], 'next');
            const changes = <SimpleChanges>{};

            joyDirective.title = 'NewTitle';
            joyDirective.text = 'NewText';
            joyDirective.ngOnChanges(changes);

            expect(emitTextSpy).not.toHaveBeenCalled();
            expect(emitTitleSpy).not.toHaveBeenCalled();
        });
    });
});
