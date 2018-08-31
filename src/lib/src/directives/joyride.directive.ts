import { Directive, ElementRef, AfterViewInit, Input, ViewContainerRef, ViewChild, Renderer2, TemplateRef, Output, EventEmitter, Inject, PLATFORM_ID } from '@angular/core';
import { JoyrideStep } from "../models/joyride-step.class";
import { JoyrideStepsContainerService } from "../services/joyride-steps-container.service";
import { JoyrideError } from "../models/joyride-error.class";
import { Router } from '@angular/router';
import { DomRefService } from '../services/dom.service';
import { isPlatformBrowser } from '@angular/common';

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

    @Input()
    stepContentParams?: Object;

    @Output()
    prev?: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    next?: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    done?: EventEmitter<any> = new EventEmitter<any>();

    private windowRef: Window;


    constructor(
        private readonly joyrideStepsContainer: JoyrideStepsContainerService,
        private readonly viewContainerRef: ViewContainerRef,
        private readonly domService: DomRefService,
        private readonly router: Router,
        @Inject(PLATFORM_ID) private platformId: Object

    ) {
        this.windowRef = this.domService.getNativeWindow()
    }

    ngAfterViewInit() {
        if (!isPlatformBrowser(this.platformId)) return;
        let step = new JoyrideStep();
        step.position = this.stepPosition;
        step.targetViewContainer = this.viewContainerRef;
        step.text = this.text;
        step.title = this.title;
        step.stepContent = this.stepContent;
        step.stepContentParams = this.stepContentParams;
        step.nextClicked = this.next;
        step.prevCliked = this.prev;
        step.tourDone = this.done;
        if (!this.name) throw new JoyrideError("All the steps should have the 'joyrideStep' property set with a custom name.");
        step.name = this.name;
        step.route = this.router.url.substr(0, 1) === '/' ? this.router.url.substr(1) : this.router.url;
        step.transformCssStyle = this.windowRef.getComputedStyle(this.viewContainerRef.element.nativeElement).transform;
        step.isElementOrAncestorFixed = this.isElementFixed(this.viewContainerRef.element) || this.isAncestorsFixed(this.viewContainerRef.element.nativeElement.parentElement);

        this.joyrideStepsContainer.addStep(step);
    }

    private isElementFixed(element: ElementRef) {
        return this.windowRef.getComputedStyle(element.nativeElement).position === 'fixed';
    }

    private isAncestorsFixed(nativeElement: any): boolean {
        if (!nativeElement.parentElement) return false;
        let isElementFixed = this.windowRef.getComputedStyle(nativeElement.parentElement).position === 'fixed';
        if (nativeElement.nodeName === 'BODY') {
            return isElementFixed;
        }
        if (isElementFixed) return true;
        else return this.isAncestorsFixed(nativeElement.parentElement);
    }

}