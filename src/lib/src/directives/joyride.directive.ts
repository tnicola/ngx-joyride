import { Directive, ElementRef, AfterViewInit, Input, ViewContainerRef, ViewChild, Renderer2, TemplateRef, Output, EventEmitter } from '@angular/core';
import { JoyrideStep } from "../models/joyride-step.class";
import { StepPosition } from "../models/joyride-step-position.enum";
import { JoyrideStepsContainerService } from "../services/joyride-steps-container.service";
import { JoyrideError } from "../models/joyride-error.class";
import { JoyrideStepService } from "../services/joyride-step.service";
import { Logger } from '../services/logger.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Button } from 'selenium-webdriver';

export const NO_POSITION = "NO_POSITION";

@Directive({
    selector: 'joyrideStep, [joyrideStep]'
})
export class JoyrideDirective implements AfterViewInit {

    @Input("joyrideStep")
    name: string;

    @Input()
    nextStep?: string;

    @Input()
    title?: string;

    @Input()
    text?: string;

    @Input()
    stepPosition?: string = NO_POSITION;

    @Input()
    stepContent?: TemplateRef<any>;

    @Output()
    prev?: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    next?: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    done?: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        private el: ElementRef,
        private readonly joyrideStepsContainer: JoyrideStepsContainerService,
        private readonly viewContainerRef: ViewContainerRef,
        private readonly router: Router
    ) { }

    ngAfterViewInit() {
        let step = new JoyrideStep();
        step.position = this.stepPosition;
        step.targetViewContainer = this.viewContainerRef;
        step.text = this.text;
        step.title = this.title;
        step.stepContent = this.stepContent;
        step.nextClicked = this.next;
        step.prevCliked = this.prev;
        step.tourDone = this.done;
        if (!this.name) throw new JoyrideError("All the steps should have the 'joyrideStep' property set with a custom name.");
        step.name = this.name;
        step.route = this.router.url.substr(0, 1) === '/' ? this.router.url.substr(1) : this.router.url;
        step.id = step.route ? `${step.name}@${step.route}` : step.name;
        step.transformCssStyle = window.getComputedStyle(this.viewContainerRef.element.nativeElement).transform;
        step.isElementOrAncestorFixed = this.isElementFixed(this.viewContainerRef.element) || this.isAncestorsFixed(this.viewContainerRef.element.nativeElement.parentElement);

        this.joyrideStepsContainer.addStep(step);
    }

    private isElementFixed(element: ElementRef) {
        return window.getComputedStyle(element.nativeElement).position === 'fixed';
    }

    private isAncestorsFixed(nativeElement: any): boolean {
        let isElementFixed = window.getComputedStyle(nativeElement.parentElement).position === 'fixed';
        if (nativeElement.nodeName === 'BODY') {
            if (isElementFixed) return true;
            else return false;
        }
        if (isElementFixed) return true;
        else return this.isAncestorsFixed(nativeElement.parentElement);
    }

}