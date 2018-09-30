import { Component, ViewChild, TemplateRef, ElementRef, ViewContainerRef, Type } from '@angular/core';
import { TestBed, async, ComponentFixture, } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { JoyrideStepComponent } from './joyride-step.component';
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
import { JoyrideStepService } from '../../services/joyride-step.service';
import { JoyrideStepFakeService } from '../../test/fake/joyride-step-fake.service';
import { FakeElementRef, FakeViewContainerRef } from '../../test/fake/dom-elements-fake.class';
import { TemplatesService } from '../../services/templates.service';
import { TemplatesFakeService } from '../../test/fake/templates-fake.service';

@Component({
    selector: 'host',
    template: `
    <div #elem>Element</div>
    <div #customTemplate>Template</div>
    <joyride-step ></joyride-step>`
})
class HostComponent {

    @ViewChild('elem') element: TemplateRef<any>;
    @ViewChild('customTemplate') customTemplate: TemplateRef<any>;

    color: string;
    onClick: jasmine.Spy = jasmine.createSpy("onClick");

    step: JoyrideStep;

    setStep(step: JoyrideStep) {
        this.step = step;
    }

}



describe("JoyrideStepComponent", () => {

    let hostFixture: ComponentFixture<HostComponent>;
    let component: JoyrideStepComponent;
    let hostComponent: HostComponent;
    let stepsContainerService: JoyrideStepsContainerServiceFake;
    let optionsService: JoyrideOptionsServiceFake;
    let joyrideStepService: JoyrideStepFakeService = new JoyrideStepFakeService();
    let documentService: DocumentServiceFake;
    let templatesService: TemplatesFakeService;
    let STEP: JoyrideStep;
    let STEP_CONTAINER: ElementRef;
    let TEMPLATE: TemplateRef<any>;


    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                HostComponent,
                JoyrideStepComponent,
                JoyrideArrowComponent,
                JoyrideButtonComponent,
                JoyrideCloseButtonComponent
            ],
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
    });

    describe("ngOnInit", () => {
        beforeEach(() => {
            STEP = new JoyrideStep();
            STEP.title = "My title";
            STEP.text = "text-abc";
            STEP.stepContent = hostComponent.element;
            STEP.stepContentParams = { param1: 'name', param2: 'surname' };
            component.step = STEP;
            templatesService.getPrevButton.and.returnValue(TEMPLATE);
            templatesService.getNextButton.and.returnValue(TEMPLATE);
            templatesService.getDoneButton.and.returnValue(TEMPLATE);
            templatesService.getCounter.and.returnValue(TEMPLATE);
        });

        it("should call documentService", () => {
            component.ngOnInit();

            expect(documentService.getDocumentHeight).toHaveBeenCalled();
        });

        it("should set the title of the step", () => {
            component.ngOnInit();

            expect(component.title).toBe(STEP.title);
        });

        it("should set the text of the step", () => {
            component.ngOnInit();

            expect(component.text).toBe(STEP.text);
        });

        it("should set the customContent of the step", () => {
            component.ngOnInit();

            expect(component.customContent).toBe(STEP.stepContent);
        });

        it("should set the customPrevButton template of the step", () => {
            component.ngOnInit();

            expect(component.customPrevButton).toBe(TEMPLATE);
        });

        it("should set the customNextButton template of the step", () => {
            component.ngOnInit();

            expect(component.customNextButton).toBe(TEMPLATE);
        });

        it("should set the customDoneButton template of the step", () => {
            component.ngOnInit();

            expect(component.customDoneButton).toBe(TEMPLATE);
        });

        it("should set the customCounter template of the step", () => {
            component.ngOnInit();

            expect(component.customCounter).toBe(TEMPLATE);
        });

        it("should set the ctx of the step", () => {
            component.ngOnInit();

            expect(component.ctx).toBe(STEP.stepContentParams);
        });

        it("should set the counter as stepPosition on numberOfSteps", () => {
            stepsContainerService.getStepPosition.and.returnValue(4);
            stepsContainerService.getNumberOfSteps.and.returnValue(10);

            component.ngOnInit();

            expect(component.counter).toBe('4/10');
        });

        it("should set isCounterVisible to true if optionsService.isCounterVisible returns true", () => {
            optionsService.isCounterVisible.and.returnValue(true);

            component.ngOnInit();

            expect(component.isCounterVisible).toBe(true);
        });

        it("should set isCounterVisible to false if optionsService.isCounterVisible returns false", () => {
            optionsService.isCounterVisible.and.returnValue(false);

            component.ngOnInit();

            expect(component.isCounterVisible).toBe(false);
        });

        it("should set isPrevButtonVisible to true if optionsService.isPrevButtonVisible returns true", () => {
            optionsService.isPrevButtonVisible.and.returnValue(true);

            component.ngOnInit();

            expect(component.isPrevButtonVisible).toBe(true);
        });

        it("should set isPrevButtonVisible to false if optionsService.isPrevButtonVisible returns false", () => {
            optionsService.isPrevButtonVisible.and.returnValue(false);

            component.ngOnInit();

            expect(component.isPrevButtonVisible).toBe(false);
        });

        it("should set themeColor to the value returned by optionsService.getThemeColor", () => {
            optionsService.getThemeColor.and.returnValue('#123456');

            component.ngOnInit();

            expect(component.themeColor).toBe('#123456');
        });
    });

    describe("ngAfterViewInit()", () => {
        beforeEach(() => {
            STEP_CONTAINER = new FakeElementRef();
            let elemRef = new FakeElementRef();
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

            it("should set stepWidth equals to the stepContainer clientWidth", () => {
                component.stepContainer = STEP_CONTAINER;

                component.ngAfterViewInit();

                expect(component.stepWidth).toBe(25);
            });

            it("should set stepHeight equals to the stepContainer clienHeight", () => {
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

            it("should set dimensions equals to the default ones", () => {
                component.ngAfterViewInit();

                expect(component.stepWidth).toBe(200);
                expect(component.stepHeight).toBe(165.01650165016503);
            });

            it("should set stepContainer dimensions equals to the default ones", () => {
                component.ngAfterViewInit();

                let stepContainer = hostFixture.debugElement.query(By.css('.joyride-step__container'));
                expect(stepContainer.nativeElement.style.width).toBe('200px');
                expect(stepContainer.nativeElement.style.height).toBe('165.017px');
            });

            it("should set stepHolder position equals to fixed if step.isElementOrAncestorFixed returns true", () => {
                STEP.isElementOrAncestorFixed = true;
                component.step = STEP;
                component.ngAfterViewInit();

                let stepHolder = hostFixture.debugElement.query(By.css('.joyride-step__holder'));
                expect(stepHolder.nativeElement.style.position).toBe('fixed');
            });

            it("should set stepHolder position equals to absolute if step.isElementOrAncestorFixed returns false", () => {
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

            describe('when the step position is "top"', () => {
                beforeEach(() => {
                    STEP.position = 'top';
                    component.step = STEP;
                    component.ngAfterViewInit();
                });

                it('should call stepsContainerService.setPosition("top") if the step position is "top"', () => {
                    expect(stepsContainerService.setPosition).toHaveBeenCalledWith(STEP, 'top');
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

                it('should call stepsContainerService.setPosition("bottom") if the step position is "bottom"', () => {
                    expect(stepsContainerService.setPosition).toHaveBeenCalledWith(STEP, 'bottom');
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

                it('should call stepsContainerService.setPosition("right") if the step position is "right"', () => {
                    expect(stepsContainerService.setPosition).toHaveBeenCalledWith(STEP, 'right');
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

                it('should call stepsContainerService.setPosition("left") if the step position is "left"', () => {
                    expect(stepsContainerService.setPosition).toHaveBeenCalledWith(STEP, 'left');
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
                    expect(stepHolder.nativeElement.style.transform).toBe('translate(-100px, -82.5083px)');

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
        it('should return true if joyrideStepService.isFirstStep() returns true', () => {
            joyrideStepService.isFirstStep.and.returnValue(true);

            expect(component.isFirstStep()).toBe(true);
        });
        it('should return false if joyrideStepService.isFirstStep() returns false', () => {
            joyrideStepService.isFirstStep.and.returnValue(false);

            expect(component.isFirstStep()).toBe(false);
        });
    });

    describe('isLastStep', () => {
        it('should return true if joyrideStepService.isLastStep() returns true', () => {
            joyrideStepService.isLastStep.and.returnValue(true);

            expect(component.isLastStep()).toBe(true);
        });
        it('should return false if joyrideStepService.isLastStep() returns false', () => {
            joyrideStepService.isLastStep.and.returnValue(false);

            expect(component.isLastStep()).toBe(false);
        });
    });




});