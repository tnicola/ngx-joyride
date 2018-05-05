import { Directive, ElementRef, AfterViewInit, Input, ViewContainerRef, ViewChild, Renderer2, TemplateRef } from '@angular/core';
import { JoyrideStep } from "../models/joyride-step.class";
import { StepPosition } from "../models/joyride-step-position.enum";
import { JoyrideStepsContainerService } from "../services/joyride-steps-container.service";
import { JoyrideError } from "../models/joyride-error.class";
import { JoyrideStepService } from "../services/joyride-step.service";

export const TARGET_ATTRIBUTE = "data-joyride-step-number";
export const NO_POSITION = "NO_POSITION";

@Directive({
    selector: 'joyrideStep, [joyrideStep]'
})
export class JoyrideDirective implements AfterViewInit {

    @Input()
    stepNumber: number;

    @Input()
    title?: string;

    @Input()
    text?: string;

    @Input()
    stepPosition?: string = NO_POSITION;

    @Input()
    stepContent?: TemplateRef<any>;

    constructor(
        private el: ElementRef,
        private readonly joyrideStepsContainer: JoyrideStepsContainerService,
        private readonly viewContainerRef: ViewContainerRef,
        private readonly renderer: Renderer2
    ) { }

    ngAfterViewInit() {
        this.validateInputs();
        let step = new JoyrideStep();
        step.idSelector = this.getStepNumber();
        this.renderer.setAttribute(this.el.nativeElement, TARGET_ATTRIBUTE, this.getStepNumber());
        step.stepNumber = this.stepNumber;
        step.position = this.stepPosition;
        step.targetViewContainer = this.viewContainerRef;
        step.text = this.text;
        step.title = this.title;
        step.stepContent = this.stepContent;

        this.joyrideStepsContainer.addStep(step);
    }

    private getStepNumber(): string {
        return this.stepNumber.toString();
    }

    private validateInputs() {
        let errors: JoyrideError[] = []
        if (this.stepNumber < 0) {
            errors.push(new JoyrideError("You have added a step with stepNumber = " + this.stepNumber + ". Steps number must be positive!"))
        }
        errors.forEach((error) => {
            throw error;
        })
    }
}