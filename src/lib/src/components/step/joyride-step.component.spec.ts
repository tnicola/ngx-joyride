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
import { JoyrideOptionsService, ObservableCustomTexts } from '../../services/joyride-options.service';
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
    let childComponent: JoyrideStepComponent;

    let fixture: ComponentFixture<JoyrideStepComponent>;
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
        childComponent = hostFixture.debugElement.query(By.directive(JoyrideStepComponent)).componentInstance;
        childComponent.joyrideStepService = joyrideStepService;
        stepsContainerService = TestBed.get(JoyrideStepsContainerService);
        optionsService = TestBed.get(JoyrideOptionsService);
        documentService = TestBed.get(DocumentService);
        templatesService = TestBed.get(TemplatesService);
        logger = TestBed.get(LoggerService);

        fixture = TestBed.createComponent(JoyrideStepComponent);
        component = fixture.componentInstance;
        component.joyrideStepService = joyrideStepService;
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
            childComponent.step = STEP;
            templatesService.getPrevButton.and.returnValue(TEMPLATE);
            templatesService.getNextButton.and.returnValue(TEMPLATE);
            templatesService.getDoneButton.and.returnValue(TEMPLATE);
            templatesService.getCounter.and.returnValue(TEMPLATE);
            optionsService.getCustomTexts.and.returnValue({});
        });

        it('should call documentService', () => {
            childComponent.ngOnInit();

            expect(documentService.getDocumentHeight).toHaveBeenCalled();
        });

        it('should set the title of the step', () => {
            childComponent.ngOnInit();

            expect(childComponent.title).toEqual(STEP.title.asObservable());
        });

        it('should set the text of the step', () => {
            childComponent.ngOnInit();

            expect(childComponent.text).toEqual(STEP.text.asObservable());
        });

        it('should set the customContent of the step', () => {
            childComponent.ngOnInit();

            expect(childComponent.customContent).toBe(STEP.stepContent);
        });

        it('should set the customPrevButton template of the step', () => {
            childComponent.ngOnInit();

            expect(childComponent.customPrevButton).toBe(TEMPLATE);
        });

        it('should set the customNextButton template of the step', () => {
            childComponent.ngOnInit();

            expect(childComponent.customNextButton).toBe(TEMPLATE);
        });

        it('should set the customDoneButton template of the step', () => {
            childComponent.ngOnInit();

            expect(childComponent.customDoneButton).toBe(TEMPLATE);
        });

        it('should set the customCounter template of the step', () => {
            childComponent.ngOnInit();

            expect(childComponent.customCounter).toBe(TEMPLATE);
        });

        it('should set the ctx of the step', () => {
            childComponent.ngOnInit();

            expect(childComponent.ctx).toBe(STEP.stepContentParams);
        });

        it('should set the counter as stepPosition on numberOfSteps', () => {
            stepsContainerService.getStepNumber.and.returnValue(4);
            stepsContainerService.getStepsCount.and.returnValue(10);

            childComponent.ngOnInit();

            expect(childComponent.counter).toBe('4/10');
        });

        it('should set isCounterVisible to true if optionsService.isCounterVisible returns true', () => {
            optionsService.isCounterVisible.and.returnValue(true);

            childComponent.ngOnInit();

            expect(childComponent.isCounterVisible).toBe(true);
        });

        it('should set isCounterVisible to false if optionsService.isCounterVisible returns false', () => {
            optionsService.isCounterVisible.and.returnValue(false);

            childComponent.ngOnInit();

            expect(childComponent.isCounterVisible).toBe(false);
        });

        it('should set isPrevButtonVisible to true if optionsService.isPrevButtonVisible returns true', () => {
            optionsService.isPrevButtonVisible.and.returnValue(true);

            childComponent.ngOnInit();

            expect(childComponent.isPrevButtonVisible).toBe(true);
        });

        it('should set isPrevButtonVisible to false if optionsService.isPrevButtonVisible returns false', () => {
            optionsService.isPrevButtonVisible.and.returnValue(false);

            childComponent.ngOnInit();

            expect(childComponent.isPrevButtonVisible).toBe(false);
        });

        it('should set themeColor to the value returned by optionsService.getThemeColor', () => {
            optionsService.getThemeColor.and.returnValue('#123456');

            childComponent.ngOnInit();

            expect(childComponent.themeColor).toBe('#123456');
        });

        it('should set the right custom text', () => {
            let prev, next, done;
            optionsService.getCustomTexts.and.returnValue(<ObservableCustomTexts>{
                prev: of('prevText'),
                next: of('nextText'),
                done: of('doneText')
            });

            childComponent.ngOnInit();

            childComponent.prevText.subscribe(text => {
                prev = text;
            });
            childComponent.nextText.subscribe(text => {
                next = text;
            });
            childComponent.doneText.subscribe(text => {
                done = text;
            });

            expect(prev).toBe('prevText');
            expect(next).toEqual('nextText');
            expect(done).toEqual('doneText');
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
            optionsService.getCustomTexts.and.returnValue({});
        });
        describe('when stepContent is defined', () => {
            beforeEach(() => {
                STEP.stepContent = hostComponent.element;
                childComponent.step = STEP;
            });

            it('should set the stepContainer max-width to CUSTOM_STEP_MAX_WIDTH_VW', () => {
                childComponent.ngAfterViewInit();
                let stepContainer = hostFixture.debugElement.query(By.css('.joyride-step__container'));

                expect(stepContainer.nativeElement.style.maxWidth).toBe('90vw');
            });

            it('should set stepWidth equals to the stepContainer clientWidth', () => {
                childComponent.stepContainer = STEP_CONTAINER;

                childComponent.ngAfterViewInit();

                expect(childComponent.stepWidth).toBe(25);
            });

            it('should set stepHeight equals to the stepContainer clienHeight', () => {
                childComponent.stepContainer = STEP_CONTAINER;

                childComponent.ngAfterViewInit();

                expect(childComponent.stepHeight).toBe(18);
            });
        });
        describe('when stepContent is not defined', () => {
            beforeEach(() => {
                STEP.stepContent = undefined;
                childComponent.step = STEP;
            });

            it('should set the stepContainer max-width to STEP_MAX_WIDTH', () => {
                childComponent.ngAfterViewInit();

                let stepContainer = hostFixture.debugElement.query(By.css('.joyride-step__container'));
                expect(stepContainer.nativeElement.style.maxWidth).toBe('400px');
            });

            it('should set dimensions equals to the default ones', () => {
                childComponent.ngAfterViewInit();

                expect(childComponent.stepWidth).toBe(200);
                expect(childComponent.stepHeight).toBe(165.01650165016503);
            });

            it('should set stepContainer dimensions equals to the default ones', () => {
                childComponent.ngAfterViewInit();

                let stepContainer = hostFixture.debugElement.query(By.css('.joyride-step__container'));
                expect(stepContainer.nativeElement.style.width).toBe('200px');
                expect(stepContainer.nativeElement.style.height).toBe('165.017px');
            });

            it('should set stepHolder position equals to fixed if step.isElementOrAncestorFixed returns true', () => {
                STEP.isElementOrAncestorFixed = true;
                childComponent.step = STEP;
                childComponent.ngAfterViewInit();

                let stepHolder = hostFixture.debugElement.query(By.css('.joyride-step__holder'));
                expect(stepHolder.nativeElement.style.position).toBe('fixed');
            });

            it('should set stepHolder position equals to absolute if step.isElementOrAncestorFixed returns false', () => {
                STEP.isElementOrAncestorFixed = false;
                childComponent.step = STEP;
                childComponent.ngAfterViewInit();

                let stepHolder = hostFixture.debugElement.query(By.css('.joyride-step__holder'));
                expect(stepHolder.nativeElement.style.position).toBe('absolute');
            });

            it("should set stepHolder 'transform' property equals to the one passed by the step", () => {
                STEP.transformCssStyle = 'translateX(-50px)';
                childComponent.step = STEP;
                childComponent.ngAfterViewInit();

                let stepHolder = hostFixture.debugElement.query(By.css('.joyride-step__holder'));
                expect(stepHolder.nativeElement.style.transform).toBe('translateX(-50px)');
            });

            it('should have id with step name on step holder div', () => {
                STEP.name = 'myStep';
                childComponent.step = STEP;
                childComponent.ngAfterViewInit();

                hostFixture.detectChanges();

                let stepHolder = hostFixture.debugElement.query(By.css('.joyride-step__holder'));
                expect(stepHolder.nativeElement.id).toBe('joyride-step-myStep');
            });

            describe('when the step position is "top"', () => {
                beforeEach(() => {
                    STEP.position = 'top';
                    childComponent.step = STEP;
                    childComponent.ngAfterViewInit();
                });

                it('should call stepsContainerService.updatePosition("top") if the step position is "top"', () => {
                    expect(stepsContainerService.updatePosition).toHaveBeenCalledWith(STEP.name, 'top');
                });

                it('should show the arrow with position "top"', () => {
                    hostFixture.detectChanges();
                    let arrow = hostFixture.debugElement.query(By.css('.joyride-step__arrow'));
                    expect(arrow).not.toBe(null);
                    expect(childComponent.arrowPosition).toBe('bottom');
                });
            });

            describe('when the step position is "bottom"', () => {
                beforeEach(() => {
                    STEP.position = 'bottom';
                    childComponent.step = STEP;
                    childComponent.ngAfterViewInit();
                });

                it('should call stepsContainerService.updatePosition("bottom") if the step position is "bottom"', () => {
                    expect(stepsContainerService.updatePosition).toHaveBeenCalledWith(STEP.name, 'bottom');
                });

                it('should show the arrow with position "bottom"', () => {
                    hostFixture.detectChanges();
                    let arrow = hostFixture.debugElement.query(By.css('.joyride-step__arrow'));
                    expect(arrow).not.toBe(null);
                    expect(childComponent.arrowPosition).toBe('top');
                });
            });

            describe('when the step position is "right"', () => {
                beforeEach(() => {
                    STEP.position = 'right';
                    childComponent.step = STEP;
                    childComponent.ngAfterViewInit();
                });

                it('should call stepsContainerService.updatePosition("right") if the step position is "right"', () => {
                    expect(stepsContainerService.updatePosition).toHaveBeenCalledWith(STEP.name, 'right');
                });

                it('should show the arrow with position "right"', () => {
                    hostFixture.detectChanges();
                    let arrow = hostFixture.debugElement.query(By.css('.joyride-step__arrow'));
                    expect(arrow).not.toBe(null);
                    expect(childComponent.arrowPosition).toBe('left');
                });
            });

            describe('when the step position is "left"', () => {
                beforeEach(() => {
                    STEP.position = 'left';
                    childComponent.step = STEP;
                    childComponent.ngAfterViewInit();
                });

                it('should call stepsContainerService.updatePosition("left") if the step position is "left"', () => {
                    expect(stepsContainerService.updatePosition).toHaveBeenCalledWith(STEP.name, 'left');
                });

                it('should show the arrow with position "left"', () => {
                    hostFixture.detectChanges();
                    let arrow = hostFixture.debugElement.query(By.css('.joyride-step__arrow'));
                    expect(arrow).not.toBe(null);
                    expect(childComponent.arrowPosition).toBe('right');
                });
            });

            describe('when the step position is "center"', () => {
                beforeEach(() => {
                    STEP.position = 'center';
                    childComponent.step = STEP;
                    childComponent.ngAfterViewInit();
                });
                xit('should set the proper style to stepHolder', () => {
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

    // TODO Implement these tests
    xdescribe('customLabels', () => {
        it('should set the correct prev text in the HTML', () => {
            component.step = STEP;
            optionsService.getCustomTexts.and.returnValue(<ObservableCustomTexts>{
                prev: of('prevText'),
                next: of('nextText'),
                done: of('doneText')
            });
            fixture.detectChanges();

            const prevText = fixture.debugElement.query(By.css('.joyride-step__prev-button'));
            expect(prevText.nativeElement).toBe('prevText');
        });
    });

    describe('prev', () => {
        it('should call joyrideStepService.prev', () => {
            childComponent.prev();

            expect(joyrideStepService.prev).toHaveBeenCalledTimes(1);
        });
    });

    describe('next', () => {
        it('should call joyrideStepService.next', () => {
            childComponent.next();

            expect(joyrideStepService.next).toHaveBeenCalledTimes(1);
        });
    });

    describe('close', () => {
        it('should call joyrideStepService.close', () => {
            childComponent.close();

            expect(joyrideStepService.close).toHaveBeenCalledTimes(1);
        });
    });

    describe('isFirstStep', () => {
        it('should return true if stepsContainerService.getStepNumber() returns 1', () => {
            childComponent.step = <JoyrideStep>{ name: 'step1' };
            stepsContainerService.getStepNumber.and.returnValue(1);

            expect(childComponent.isFirstStep()).toBe(true);
        });

        it('should return false if stepsContainerService.getStepNumber() does not return 1', () => {
            childComponent.step = <JoyrideStep>{ name: 'step1' };
            stepsContainerService.getStepNumber.and.returnValue(0);

            expect(childComponent.isFirstStep()).toBe(false);
        });
    });

    describe('isLastStep', () => {
        it('should return true if the step number is equals to the numbers of steps', () => {
            childComponent.step = <JoyrideStep>{ name: 'step1' };
            stepsContainerService.getStepNumber.and.returnValue(5);
            stepsContainerService.getStepsCount.and.returnValue(5);

            expect(childComponent.isLastStep()).toBe(true);
        });

        it('should return false if the step number is NOT equals to the numbers of steps', () => {
            childComponent.step = <JoyrideStep>{ name: 'step1' };
            stepsContainerService.getStepNumber.and.returnValue(5);
            stepsContainerService.getStepsCount.and.returnValue(6);

            expect(childComponent.isLastStep()).toBe(false);
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
            spyOn(childComponent, 'adjustDimensions').and.returnValue({ width: 100, height: 30 });

            childComponent.step = STEP;
            childComponent.ngAfterViewInit();

            expect(childComponent.leftPosition).toBe(DEFAULT_DISTANCE_FROM_MARGIN_LEFT);
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
            spyOn(childComponent, 'adjustDimensions').and.returnValue({ width: 100, height: 30 });

            childComponent.step = STEP;
            childComponent.ngAfterViewInit();

            expect(childComponent.leftPosition).toBe(DEFAULT_DISTANCE_FROM_MARGIN_LEFT);
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
            spyOn(childComponent, 'adjustDimensions').and.returnValue({ width: 100, height: 30 });

            childComponent.step = STEP;
            childComponent.ngAfterViewInit();

            expect(childComponent.leftPosition).toBe(70 + DISTANCE_FROM_TARGET);
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
            spyOn(childComponent, 'adjustDimensions').and.returnValue({ width: 100, height: 30 });

            childComponent.step = STEP;
            childComponent.ngAfterViewInit();

            expect(childComponent.leftPosition).toBe(DEFAULT_DISTANCE_FROM_MARGIN_LEFT);
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
            spyOn(childComponent, 'adjustDimensions').and.returnValue({ width: 100, height: 100 });

            childComponent.step = STEP;
            childComponent.ngAfterViewInit();

            expect(childComponent.topPosition).toBe(DEFAULT_DISTANCE_FROM_MARGIN_TOP);
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
            spyOn(childComponent, 'adjustDimensions').and.returnValue({ width: 100, height: 100 });

            childComponent.step = STEP;
            childComponent.ngAfterViewInit();

            expect(childComponent.topPosition).toBe(DEFAULT_DISTANCE_FROM_MARGIN_TOP);
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
            spyOn(childComponent, 'adjustDimensions').and.returnValue({ width: 100, height: 100 });

            childComponent.step = STEP;
            childComponent.ngAfterViewInit();

            expect(childComponent.topPosition).toBe(DEFAULT_DISTANCE_FROM_MARGIN_TOP);
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
            spyOn(childComponent, 'adjustDimensions').and.returnValue({ width: 100, height: 100 });

            childComponent.step = STEP;
            childComponent.ngAfterViewInit();

            expect(childComponent.topPosition).toBe(targetAbsoluteLeft + targetHeight + DISTANCE_FROM_TARGET);
        });
    });

    describe('autofixTopPosition()', () => {
        // TODO: Improve these tests since they are calling a private method
        it(`should NOT log 'No step positions found...' if called once`, () => {
            childComponent['autofixTopPosition']();
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
            spyOn(childComponent, 'adjustDimensions').and.returnValue({ width: 100, height: stepHeight });

            childComponent.step = STEP;
            childComponent.ngAfterViewInit(); // autofixTopPosition called for the first time
            childComponent['autofixTopPosition']();

            expect(logger.warn).toHaveBeenCalledWith('No step positions found for this step. The step will be centered.');
        });
    });
});
