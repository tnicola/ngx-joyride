import { TestBed, ComponentFixture } from '@angular/core/testing';
import { JoyrideDirective } from './joyride.directive';
import { JoyrideStepsContainerService } from '../services/joyride-steps-container.service';
import { JoyrideStepsContainerServiceFake } from '../test/fake/joyride-steps-container-fake.service';
import { Component, DebugElement } from '@angular/core';
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
            <div style="transform: translateX(-50px)" joyrideStep="myStep" title="Title" (prev)="onPrev()" (next)="onNext()" (done)="onDone()">Test</div>
        </div>
    </div>
    `
})

class HostComponent {
    onPrev: jasmine.Spy = jasmine.createSpy("onPrev");
    onNext: jasmine.Spy = jasmine.createSpy("onNext");
    onDone: jasmine.Spy = jasmine.createSpy("onDone");
}

@Component({
    selector: 'cmp-fixed',
    template: `<div style="position: fixed" joyrideStep="myStep" title="Title">Test</div>`
})

class HostComponentFixed { }

@Component({
    selector: 'cmp-fixed',
    template: `<div joyrideStep="myStep" title="Title">Test</div>`
})

class HostComponentNotFixed { }

describe('JorideDirective', () => {

    let stepContainerService: JoyrideStepsContainerServiceFake;
    let fixture: ComponentFixture<any>;
    let hostComponent: HostComponent;
    let joyDirectiveDebugElement: DebugElement;
    let joyDirective: JoyrideDirective;
    let routerService: RouterFake;

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
    }

    beforeEach(() => {
        fixture = TestBed.createComponent(HostComponent);
        hostComponent = fixture.componentInstance;
        initDirective();
    });

    describe('ngAfterViewInit', () => {
        it('should add the step to the stepContainerService', () => {
            fixture.detectChanges();

            expect(stepContainerService.addStep).toHaveBeenCalledTimes(1);
        });

        it('should set the route without /', () => {
            routerService.url = '/my/route';

            fixture.detectChanges();
            let stepAdded: JoyrideStep = stepContainerService.addStep.calls.argsFor(0)[0];

            expect(stepAdded.route).toBe('my/route');
        });

        it('should set the route to empty if it\'s on the root route', () => {
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
            fixture = TestBed.createComponent(HostComponentFixed);
            initDirective();
            fixture.detectChanges();
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

        xit('should throw a JoyrideError if the step name is not defined', () => {
            joyDirective.name = '';

            fixture.detectChanges();

            expect(joyDirective.ngAfterViewInit).toThrow(new JoyrideError("All the steps should have the 'joyrideStep' property set with a custom name."));
        });
    });

});