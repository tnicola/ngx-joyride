import { Component, ViewChild, TemplateRef, ElementRef, ViewContainerRef, Type } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { JoyrideStepComponent, DEFAULT_DISTANCE_FROM_MARGIN_LEFT, DEFAULT_DISTANCE_FROM_MARGIN_TOP } from './joyride-step.component';
import { JoyrideStepsContainerService } from '../../services/joyride-steps-container.service';
import { JoyrideStepsContainerServiceFake } from '../../test/fake/joyride-steps-container-fake.service';
import { EventListenerService } from '../../services/event-listener.service';
import { EventListenerServiceFake } from '../../test/fake/event-listener-fake.service';
import { DocumentService } from '../../services/document.service';
import { DocumentServiceFake } from '../../test/fake/document-fake.service';
import { LoggerFake } from '../../test/fake/logger-fake.service';
import { LoggerService } from '../../services/logger.service';
import { JoyrideOptionsServiceFake } from '../../test/fake/joyride-options-fake.service';
import { JoyrideStep } from '../../models/joyride-step.class';
import { JoyrideOptionsService } from '../../services/joyride-options.service';
import { JoyrideArrowComponent } from '../arrow/arrow.component';
import { JoyrideButtonComponent } from '../button/button.component';
import { JoyrideCloseButtonComponent } from '../close-button/close-button.component';
import { JoyrideStepService, DISTANCE_FROM_TARGET } from '../../services/joyride-step.service';
import { JoyrideStepFakeService } from '../../test/fake/joyride-step-fake.service';
import { FakeElementRef, FakeViewContainerRef } from '../../test/fake/dom-elements-fake.class';
import { TemplatesService } from '../../services/templates.service';
import { TemplatesFakeService } from '../../test/fake/templates-fake.service';
import { of } from 'rxjs';

@Component({
    selector: 'host',
    template: `
        <div #elem>Element</div>
        <div #customTemplate>Template</div>
        <joyride-step></joyride-step>
    `
})
class HostComponent {
    @ViewChild('elem') element: TemplateRef<any>;
    @ViewChild('customTemplate') customTemplate: TemplateRef<any>;

    color: string;
    onClick: jasmine.Spy = jasmine.createSpy('onClick');

    step: JoyrideStep;

    setStep(step: JoyrideStep) {
        this.step = step;
    }
}

describe('JoyrideStepComponent', () => {
    let hostFixture: ComponentFixture<HostComponent>;
    let component: JoyrideStepComponent;
    let hostComponent: HostComponent;
    let stepsContainerService: JoyrideStepsContainerServiceFake;
    let optionsService: JoyrideOptionsServiceFake;
    let joyrideStepService: JoyrideStepFakeService = new JoyrideStepFakeService();
    let documentService: DocumentServiceFake;
    let templatesService: TemplatesFakeService;
    let logger: LoggerFake;
    let STEP: JoyrideStep;
    let STEP_CONTAINER: ElementRef;
    let TEMPLATE: TemplateRef<any>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [HostComponent, JoyrideStepComponent, JoyrideArrowComponent, JoyrideButtonComponent, JoyrideCloseButtonComponent],
            providers: [
                { provide: JoyrideStepsContainerService, useClass: JoyrideStepsContainerServiceFake },
                { provide: EventListenerService, useClass: EventListenerServiceFake },
                { provide: DocumentService, useClass: DocumentServiceFake },
                { provide: LoggerService, useClass: LoggerFake },
                { provide: JoyrideOptionsService, useClass: JoyrideOptionsServiceFake },
                { provide: JoyrideStepService, useClass: JoyrideStepFakeService },
                { provide: TemplatesService, useClass: TemplatesFakeService }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        hostFixture = TestBed.createComponent(HostComponent);
        hostComponent = hostFixture.componentInstance;
        component = hostFixture.debugElement.query(By.directive(JoyrideStepComponent)).componentInstance;
        component.joyrideStepService = joyrideStepService;
        stepsContainerService = TestBed.get(JoyrideStepsContainerService);
        optionsService = TestBed.get(JoyrideOptionsService);
        documentService = TestBed.get(DocumentService);
        templatesService = TestBed.get(TemplatesService);
        logger = TestBed.get(LoggerService);
    });

    describe('ngOnInit', () => {
        beforeEach(() => {
            let elemRef = new FakeElementRef(10, 15);
            STEP = new JoyrideStep();
            STEP.targetViewContainer = new FakeViewContainerRef(elemRef);
            STEP.title.next('My title');
            STEP.text.next('text-abc');
            STEP.stepContent = hostComponent.element;
            STEP.stepContentParams = { param1: 'name', param2: 'surname' };
            STEP.name = 'myStepName';
            component.step = STEP;
            templatesService.getPrevButton.and.returnValue(TEMPLATE);
            templatesService.getNextButton.and.returnValue(TEMPLATE);
            templatesService.getDoneButton.and.returnValue(TEMPLATE);
            templatesService.getCounter.and.returnValue(TEMPLATE);
        });

        it('should call documentService', () => {
            component.ngOnInit();

            expect(documentService.getDocumentHeight).toHaveBeenCalled();
        });

        it('should set the title of the step', () => {
            component.ngOnInit();

            expect(component.title).toEqual(STEP.title.asObservable());
        });

        it('should set the text of the step', () => {
            component.ngOnInit();

            expect(component.text).toEqual(STEP.text.asObservable());
        });

        it('should set the customContent of the step', () => {
            component.ngOnInit();

            expect(component.customContent).toBe(STEP.stepContent);
        });

        it('should set the customPrevButton template of the step', () => {
            component.ngOnInit();

            expect(component.customPrevButton).toBe(TEMPLATE);
        });

        it('should set the customNextButton template of the step', () => {
            component.ngOnInit();

            expect(component.customNextButton).toBe(TEMPLATE);
        });

        it('should set the customDoneButton template of the step', () => {
            component.ngOnInit();

            expect(component.customDoneButton).toBe(TEMPLATE);
        });

        it('should set the customCounter template of the step', () => {
            component.ngOnInit();

            expect(component.customCounter).toBe(TEMPLATE);
        });

        it('should set the ctx of the step', () => {
            component.ngOnInit();

            expect(component.ctx).toBe(STEP.stepContentParams);
        });

        it('should set the counter as stepPosition on numberOfSteps', () => {
            stepsContainerService.getStepNumber.and.returnValue(4);
            stepsContainerService.getStepsCount.and.returnValue(10);

            component.ngOnInit();

            expect(component.counter).toBe('4/10');
        });

        it('should set isCounterVisible to true if optionsService.isCounterVisible returns true', () => {
            optionsService.isCounterVisible.and.returnValue(true);

            component.ngOnInit();

            expect(component.isCounterVisible).toBe(true);
        });

        it('should set isCounterVisible to false if optionsService.isCounterVisible returns false', () => {
            optionsService.isCounterVisible.and.returnValue(false);

            component.ngOnInit();

            expect(component.isCounterVisible).toBe(false);
        });

        it('should set isPrevButtonVisible to true if optionsService.isPrevButtonVisible returns true', () => {
            optionsService.isPrevButtonVisible.and.returnValue(true);

            component.ngOnInit();

            expect(component.isPrevButtonVisible).toBe(true);
        });

        it('should set isPrevButtonVisible to false if optionsService.isPrevButtonVisible returns false', () => {
            optionsService.isPrevButtonVisible.and.returnValue(false);

            component.ngOnInit();

            expect(component.isPrevButtonVisible).toBe(false);
        });

        it('should set themeColor to the value returned by optionsService.getThemeColor', () => {
            optionsService.getThemeColor.and.returnValue('#123456');

            component.ngOnInit();

            expect(component.themeColor).toBe('#123456');
        });
    });

    describe('ngAfterViewInit()', () => {
        beforeEach(() => {
            STEP_CONTAINER = new FakeElementRef(10, 15);
            let elemRef = new FakeElementRef(10, 15);
            STEP = new JoyrideStep();
            STEP.targetViewContainer = new FakeViewContainerRef(elemRef);
            STEP_CONTAINER.nativeElement.clientWidth = 25;
            STEP_CONTAINER.nativeElement.clientHeight = 18;
        });
        describe('when stepContent is defined', () => {
            beforeEach(() => {
                STEP.stepContent = hostComponent.element;
                component.step = STEP;
            });

            it('should set the stepContainer max-width to CUSTOM_STEP_MAX_WIDTH_VW', () => {
                component.ngAfterViewInit();
                let stepContainer = hostFixture.debugElement.query(By.css('.joyride-step__container'));

                expect(stepContainer.nativeElement.style.maxWidth).toBe('90vw');
            });

            it('should set stepWidth equals to the stepContainer clientWidth', () => {
                component.stepContainer = STEP_CONTAINER;

                component.ngAfterViewInit();

                expect(component.stepWidth).toBe(25);
            });

            it('should set stepHeight equals to the stepContainer clienHeight', () => {
                component.stepContainer = STEP_CONTAINER;

                component.ngAfterViewInit();

                expect(component.stepHeight).toBe(18);
            });
        });
        describe('when stepContent is not defined', () => {
            beforeEach(() => {
                STEP.stepContent = undefined;
                component.step = STEP;
            });

            it('should set the stepContainer max-width to STEP_MAX_WIDTH', () => {
                component.ngAfterViewInit();

                let stepContainer = hostFixture.debugElement.query(By.css('.joyride-step__container'));
                expect(stepContainer.nativeElement.style.maxWidth).toBe('400px');
            });

            it('should set dimensions equals to the default ones', () => {
                component.ngAfterViewInit();

                expect(component.stepWidth).toBe(200);
                expect(component.stepHeight).toBe(165.01650165016503);
            });

            it('should set stepContainer dimensions equals to the default ones', () => {
                component.ngAfterViewInit();

                let stepContainer = hostFixture.debugElement.query(By.css('.joyride-step__container'));
                expect(stepContainer.nativeElement.style.width).toBe('200px');
                expect(stepContainer.nativeElement.style.height).toBe('165.017px');
            });

            it('should set stepHolder position equals to fixed if step.isElementOrAncestorFixed returns true', () => {
                STEP.isElementOrAncestorFixed = true;
                component.step = STEP;
                component.ngAfterViewInit();

                let stepHolder = hostFixture.debugElement.query(By.css('.joyride-step__holder'));
                expect(stepHolder.nativeElement.style.position).toBe('fixed');
            });

            it('should set stepHolder position equals to absolute if step.isElementOrAncestorFixed returns false', () => {
                STEP.isElementOrAncestorFixed = false;
                component.step = STEP;
                component.ngAfterViewInit();

                let stepHolder = hostFixture.debugElement.query(By.css('.joyride-step__holder'));
                expect(stepHolder.nativeElement.style.position).toBe('absolute');
            });

            it("should set stepHolder 'transform' property equals to the one passed by the step", () => {
                STEP.transformCssStyle = 'translateX(-50px)';
                component.step = STEP;
                component.ngAfterViewInit();

                let stepHolder = hostFixture.debugElement.query(By.css('.joyride-step__holder'));
                expect(stepHolder.nativeElement.style.transform).toBe('translateX(-50px)');
            });

            it('should have id with step name on step holder div', () => {
                STEP.name = "myStep";
                component.step = STEP;
                component.ngAfterViewInit();

                hostFixture.detectChanges();

                let stepHolder = hostFixture.debugElement.query(By.css('.joyride-step__holder'));
                expect(stepHolder.nativeElement.id).toBe('joyride-step-myStep');
            });

            describe('when the step position is "top"', () => {
                beforeEach(() => {
                    STEP.position = 'top';
                    component.step = STEP;
                    component.ngAfterViewInit();
                });

                it('should call stepsContainerService.updatePosition("top") if the step position is "top"', () => {
                    expect(stepsContainerService.updatePosition).toHaveBeenCalledWith(STEP.name, 'top');
                });

                it('should show the arrow with position "top"', () => {
                    hostFixture.detectChanges();
                    let arrow = hostFixture.debugElement.query(By.css('.joyride-step__arrow'));
                    expect(arrow).not.toBe(null);
                    expect(component.arrowPosition).toBe('bottom');
                });
            });

            describe('when the step position is "bottom"', () => {
                beforeEach(() => {
                    STEP.position = 'bottom';
                    component.step = STEP;
                    component.ngAfterViewInit();
                });

                it('should call stepsContainerService.updatePosition("bottom") if the step position is "bottom"', () => {
                    expect(stepsContainerService.updatePosition).toHaveBeenCalledWith(STEP.name, 'bottom');
                });

                it('should show the arrow with position "bottom"', () => {
                    hostFixture.detectChanges();
                    let arrow = hostFixture.debugElement.query(By.css('.joyride-step__arrow'));
                    expect(arrow).not.toBe(null);
                    expect(component.arrowPosition).toBe('top');
                });
            });

            describe('when the step position is "right"', () => {
                beforeEach(() => {
                    STEP.position = 'right';
                    component.step = STEP;
                    component.ngAfterViewInit();
                });

                it('should call stepsContainerService.updatePosition("right") if the step position is "right"', () => {
                    expect(stepsContainerService.updatePosition).toHaveBeenCalledWith(STEP.name, 'right');
                });

                it('should show the arrow with position "right"', () => {
                    hostFixture.detectChanges();
                    let arrow = hostFixture.debugElement.query(By.css('.joyride-step__arrow'));
                    expect(arrow).not.toBe(null);
                    expect(component.arrowPosition).toBe('left');
                });
            });

            describe('when the step position is "left"', () => {
                beforeEach(() => {
                    STEP.position = 'left';
                    component.step = STEP;
                    component.ngAfterViewInit();
                });

                it('should call stepsContainerService.updatePosition("left") if the step position is "left"', () => {
                    expect(stepsContainerService.updatePosition).toHaveBeenCalledWith(STEP.name, 'left');
                });

                it('should show the arrow with position "left"', () => {
                    hostFixture.detectChanges();
                    let arrow = hostFixture.debugElement.query(By.css('.joyride-step__arrow'));
                    expect(arrow).not.toBe(null);
                    expect(component.arrowPosition).toBe('right');
                });
            });

            describe('when the step position is "center"', () => {
                beforeEach(() => {
                    STEP.position = 'center';
                    component.step = STEP;
                    component.ngAfterViewInit();
                });
                it('should set the proper style to stepHolder', () => {
                    let stepHolder = hostFixture.debugElement.query(By.css('.joyride-step__holder'));
                    expect(stepHolder.nativeElement.style.position).toBe('fixed');
                    expect(stepHolder.nativeElement.style.top).toBe('50%');
                    expect(stepHolder.nativeElement.style.left).toBe('50%');
                    expect(stepHolder.nativeElement.style.transform).toBe('translate(-100px, -82.5px)');
                });

                it('should hide the arrow', () => {
                    hostFixture.detectChanges();
                    let arrow = hostFixture.debugElement.query(By.css('.joyride-step__arrow'));
                    expect(arrow).toBe(null);
                });
            });
        });
    });

    describe('prev', () => {
        it('should call joyrideStepService.prev', () => {
            component.prev();

            expect(joyrideStepService.prev).toHaveBeenCalledTimes(1);
        });
    });

    describe('next', () => {
        it('should call joyrideStepService.next', () => {
            component.next();

            expect(joyrideStepService.next).toHaveBeenCalledTimes(1);
        });
    });

    describe('close', () => {
        it('should call joyrideStepService.close', () => {
            component.close();

            expect(joyrideStepService.close).toHaveBeenCalledTimes(1);
        });
    });

    describe('isFirstStep', () => {
        it('should return true if stepsContainerService.getStepNumber() returns 1', () => {
            component.step = <JoyrideStep>{ name: 'step1' };
            stepsContainerService.getStepNumber.and.returnValue(1);

            expect(component.isFirstStep()).toBe(true);
        });

        it('should return false if stepsContainerService.getStepNumber() does not return 1', () => {
            component.step = <JoyrideStep>{ name: 'step1' };
            stepsContainerService.getStepNumber.and.returnValue(0);

            expect(component.isFirstStep()).toBe(false);
        });
    });

    describe('isLastStep', () => {
        it('should return true if the step number is equals to the numbers of steps', () => {
            component.step = <JoyrideStep>{ name: 'step1' };
            stepsContainerService.getStepNumber.and.returnValue(5);
            stepsContainerService.getStepsCount.and.returnValue(5);

            expect(component.isLastStep()).toBe(true);
        });

        it('should return false if the step number is NOT equals to the numbers of steps', () => {
            component.step = <JoyrideStep>{ name: 'step1' };
            stepsContainerService.getStepNumber.and.returnValue(5);
            stepsContainerService.getStepsCount.and.returnValue(6);

            expect(component.isLastStep()).toBe(false);
        });
    });

    describe('adjust LEFT Position', () => {
        it('should prevent to draw the step outside setting leftPosition to DEFAULT_DISTANCE_FROM_MARGIN_LEFT when the step position is top', () => {
            const targetWidth = 50;
            let elemRef = new FakeElementRef(targetWidth, 10);
            let STEP = new JoyrideStep();
            STEP.targetViewContainer = new FakeViewContainerRef(elemRef);
            STEP.position = 'top';

            // Set targetAbsoluteLeft
            STEP.isElementOrAncestorFixed = false;
            documentService.getElementAbsoluteLeft.and.returnValue(20);

            // Set stepWidth
            spyOn(component, 'adjustDimensions').and.returnValue({ width: 100, height: 30 });

            component.step = STEP;
            component.ngAfterViewInit();

            expect(component.leftPosition).toBe(DEFAULT_DISTANCE_FROM_MARGIN_LEFT);
        });
        it('should prevent to draw the step outside setting leftPosition to DEFAULT_DISTANCE_FROM_MARGIN_LEFT when the step position is bottom', () => {
            const targetWidth = 50;
            let elemRef = new FakeElementRef(targetWidth, 10);
            let STEP = new JoyrideStep();
            STEP.targetViewContainer = new FakeViewContainerRef(elemRef);
            STEP.position = 'bottom';

            // Set targetAbsoluteLeft
            STEP.isElementOrAncestorFixed = false;
            documentService.getElementAbsoluteLeft.and.returnValue(20);

            // Set stepWidth
            spyOn(component, 'adjustDimensions').and.returnValue({ width: 100, height: 30 });

            component.step = STEP;
            component.ngAfterViewInit();

            expect(component.leftPosition).toBe(DEFAULT_DISTANCE_FROM_MARGIN_LEFT);
        });
        it('should NOT prevent to draw the step outside setting leftPosition to DEFAULT_DISTANCE_FROM_MARGIN_LEFT when the step position is right', () => {
            const targetWidth = 50;
            let elemRef = new FakeElementRef(targetWidth, 10);
            let STEP = new JoyrideStep();
            STEP.targetViewContainer = new FakeViewContainerRef(elemRef);
            STEP.position = 'right';

            // Set targetAbsoluteLeft
            STEP.isElementOrAncestorFixed = false;
            documentService.getElementAbsoluteLeft.and.returnValue(20);

            // Set stepWidth
            spyOn(component, 'adjustDimensions').and.returnValue({ width: 100, height: 30 });

            component.step = STEP;
            component.ngAfterViewInit();

            expect(component.leftPosition).toBe(70 + DISTANCE_FROM_TARGET);
        });
        it('should prevent to draw the step outside setting leftPosition to DEFAULT_DISTANCE_FROM_MARGIN_LEFT when the step position is left', () => {
            const targetWidth = 50;
            let elemRef = new FakeElementRef(targetWidth, 10);
            let STEP = new JoyrideStep();
            STEP.targetViewContainer = new FakeViewContainerRef(elemRef);
            STEP.position = 'left';

            // Set targetAbsoluteLeft
            STEP.isElementOrAncestorFixed = false;
            documentService.getElementAbsoluteLeft.and.returnValue(20);

            // Set stepWidth
            spyOn(component, 'adjustDimensions').and.returnValue({ width: 100, height: 30 });

            component.step = STEP;
            component.ngAfterViewInit();

            expect(component.leftPosition).toBe(DEFAULT_DISTANCE_FROM_MARGIN_LEFT);
        });
    });

    describe('adjust TOP Position', () => {
        it('should prevent to draw the step outside setting topPosition to DEFAULT_DISTANCE_FROM_MARGIN_TOP when the step position is right', () => {
            const targetHeight = 50;
            let elemRef = new FakeElementRef(19, targetHeight);
            let STEP = new JoyrideStep();
            STEP.targetViewContainer = new FakeViewContainerRef(elemRef);
            STEP.position = 'right';

            // Set targetAbsoluteLeft
            STEP.isElementOrAncestorFixed = false;
            documentService.getElementAbsoluteTop.and.returnValue(20);

            // Set stepWidth
            spyOn(component, 'adjustDimensions').and.returnValue({ width: 100, height: 100 });

            component.step = STEP;
            component.ngAfterViewInit();

            expect(component.topPosition).toBe(DEFAULT_DISTANCE_FROM_MARGIN_TOP);
        });
        it('should prevent to draw the step outside setting topPosition to DEFAULT_DISTANCE_FROM_MARGIN_TOP when the step position is left', () => {
            const targetHeight = 50;
            let elemRef = new FakeElementRef(19, targetHeight);
            let STEP = new JoyrideStep();
            STEP.targetViewContainer = new FakeViewContainerRef(elemRef);
            STEP.position = 'left';

            // Set targetAbsoluteLeft
            STEP.isElementOrAncestorFixed = false;
            documentService.getElementAbsoluteTop.and.returnValue(20);

            // Set stepWidth
            spyOn(component, 'adjustDimensions').and.returnValue({ width: 100, height: 100 });

            component.step = STEP;
            component.ngAfterViewInit();

            expect(component.topPosition).toBe(DEFAULT_DISTANCE_FROM_MARGIN_TOP);
        });
        it('should prevent to draw the step outside setting topPosition to DEFAULT_DISTANCE_FROM_MARGIN_TOP when the step position is top', () => {
            const targetHeight = 50;
            let elemRef = new FakeElementRef(19, targetHeight);
            let STEP = new JoyrideStep();
            STEP.targetViewContainer = new FakeViewContainerRef(elemRef);
            STEP.position = 'top';

            // Set targetAbsoluteLeft
            STEP.isElementOrAncestorFixed = false;
            documentService.getElementAbsoluteTop.and.returnValue(20);

            // Set stepWidth
            spyOn(component, 'adjustDimensions').and.returnValue({ width: 100, height: 100 });

            component.step = STEP;
            component.ngAfterViewInit();

            expect(component.topPosition).toBe(DEFAULT_DISTANCE_FROM_MARGIN_TOP);
        });
        it('should NOT prevent to draw the step outside setting topPosition to DEFAULT_DISTANCE_FROM_MARGIN_TOP when the step position is bottom', () => {
            const targetHeight = 50;
            let elemRef = new FakeElementRef(19, targetHeight);
            let STEP = new JoyrideStep();
            STEP.targetViewContainer = new FakeViewContainerRef(elemRef);
            STEP.position = 'bottom';

            // Set
            const targetAbsoluteLeft = 20;
            STEP.isElementOrAncestorFixed = false;
            documentService.getElementAbsoluteTop.and.returnValue(targetAbsoluteLeft);

            // Set stepWidth
            spyOn(component, 'adjustDimensions').and.returnValue({ width: 100, height: 100 });

            component.step = STEP;
            component.ngAfterViewInit();

            expect(component.topPosition).toBe(targetAbsoluteLeft + targetHeight + DISTANCE_FROM_TARGET);
        });
    });

    describe('autofixTopPosition()', () => {
        // TODO: Improve these tests since they are calling a private method
        it(`should NOT log 'No step positions found...' if called once`, () => {
            component['autofixTopPosition']();
            expect(logger.warn).not.toHaveBeenCalled();
        });
        it(`should log 'No step positions found...' if called twice and the step does not fit the TOP position`, () => {
            const targetHeight = 50;
            let elemRef = new FakeElementRef(19, targetHeight);
            let STEP = new JoyrideStep();
            STEP.targetViewContainer = new FakeViewContainerRef(elemRef);
            STEP.position = 'top';

            // Set targetAbsoluteLeft
            const targetAbsoluteHeight = 20;
            STEP.isElementOrAncestorFixed = false;
            documentService.getElementAbsoluteTop.and.returnValue(targetAbsoluteHeight);

            // Set stepHeight
            const stepHeight = 100;
            spyOn(component, 'adjustDimensions').and.returnValue({ width: 100, height: stepHeight });

            component.step = STEP;
            component.ngAfterViewInit(); // autofixTopPosition called for the first time
            component['autofixTopPosition']();

            expect(logger.warn).toHaveBeenCalledWith('No step positions found for this step. The step will be centered.');
        });
    });
});
