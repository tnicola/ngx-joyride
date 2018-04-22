import { Component, Input, AfterViewInit, forwardRef, Inject, ViewEncapsulation, OnInit, OnDestroy, ViewContainerRef, ElementRef, ViewChild, Renderer2, Injector } from "@angular/core";
import { JoyrideStep } from "../models/joyride-step.class";
import { JoyrideStepService, ARROW_SIZE, DISTANCE_FROM_TARGET } from "../services/joyride-step.service";
import { JoyrideStepsContainerService } from "../services/joyride-steps-container.service";
import { EventListenerService } from "../services/event-listener.service";
import { Subscription } from "rxjs/Subscription";
import { DocumentService } from "../services/document.service";
import { JoyrideOptionsService } from "../services/joyride-options.service";

const STEP_MIN_WIDTH = 200;
const STEP_MAX_WIDTH = 400;
const STEP_HEIGHT = 200;
const ASPECT_RATIO = 1.212;
const DEFAULT_DISTANCE_FROM_MARGIN_LEFT = 2;
const DEFAULT_DISTANCE_FROM_MARGIN_RIGHT = 5;
const closeSvg = require('../assets/images/close.svg');

@Component({
    selector: 'joyride-step',
    templateUrl: './joyride-step.component.html',
    styleUrls: ['./joyride-step.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class JoyrideStepComponent implements OnInit, OnDestroy, AfterViewInit {

    stepWidth: number = STEP_MIN_WIDTH;
    stepHeight: number = STEP_HEIGHT;
    leftPosition: number;
    topPosition: number;
    arrowPosition: string;
    arrowLeftPosition: number;
    arrowTopPosition: number;

    closeSvg = closeSvg;

    title: string;
    text: string;
    counter: string;

    private arrowSize: number = ARROW_SIZE;
    private stepAbsoluteLeft: number;
    private targetWidth: number;
    targetHeight: number;
    private targetOffsetTop: number;
    private targetOffsetLeft: number;
    private targetAbsoluteLeft: number;
    private targetAbsoluteTop: number;

    private subscriptions: Subscription[] = [];
    private joyrideStepService: JoyrideStepService;

    @Input() step?: JoyrideStep;

    @ViewChild('stepContainer') stepContainer: ElementRef;

    constructor(
        injector: Injector,
        private readonly stepsContainerService: JoyrideStepsContainerService,
        private readonly eventListenerService: EventListenerService,
        private readonly documentService: DocumentService,
        private readonly viewContainerRef: ViewContainerRef,
        private readonly renderer: Renderer2
    ) {
        this.joyrideStepService = injector.get(JoyrideStepService)
    }

    ngOnInit(): void {
        this.subscriptions.push(this.subscribeToResizeEvents());
        this.title = this.step.title;
        this.text = this.step.text;
        this.counter = this.getCounter();
    }

    ngAfterViewInit() {
        let dimensions = this.getDimensionsByAspectRatio(this.stepContainer.nativeElement.clientWidth, this.stepContainer.nativeElement.clientHeight, ASPECT_RATIO);
        dimensions = this.adjustDimensions(dimensions.width, dimensions.height);
        this.stepWidth = dimensions.width;
        this.stepHeight = dimensions.height;
        this.renderer.setStyle(this.stepContainer.nativeElement, "width", this.stepWidth + 'px');
        this.renderer.setStyle(this.stepContainer.nativeElement, "height", this.stepHeight + 'px');
        this.drawStep();
    }

    private drawStep() {
        this.targetWidth = this.step.targetViewContainer.element.nativeElement.getBoundingClientRect().width;
        this.targetHeight = this.step.targetViewContainer.element.nativeElement.getBoundingClientRect().height;
        this.targetOffsetTop = this.step.targetViewContainer.element.nativeElement.offsetTop;
        this.targetOffsetLeft = this.step.targetViewContainer.element.nativeElement.offsetLeft;
        this.targetAbsoluteLeft = this.documentService.getElementAbsoluteLeft(this.step.targetViewContainer.element);
        this.targetAbsoluteTop = this.documentService.getElementAbsoluteTop(this.step.targetViewContainer.element);
        this.setStepStyle();
    }

    private getCounter(): string {
        let stepPosition = this.stepsContainerService.getStepPosition(this.step);
        let numberOfStep = this.stepsContainerService.getNumberOfSteps();
        return stepPosition + '/' + numberOfStep;
    }

    prev() {
        this.joyrideStepService.prev()
    }

    next() {
        this.joyrideStepService.next();
    }

    close() {
        this.joyrideStepService.close();
    }

    isFirstStep() {
        return this.joyrideStepService.isFirstStep();
    }

    isLastStep() {
        return this.joyrideStepService.isLastStep();
    }

    private setStepStyle() {
        switch (this.step.position) {
            case 'top': {
                this.setStyleTop();
                break;
            }
            case 'bottom': {
                this.setStyleBottom();
                break;
            }
            default: {
                this.setStyleBottom();
            }
        }
    }

    private setStyleBottom() {
        this.topPosition = this.targetOffsetTop + this.targetHeight + DISTANCE_FROM_TARGET;
        this.arrowTopPosition = -this.arrowSize;

        this.arrowLeftPosition = this.stepWidth / 2 - this.arrowSize;
        this.leftPosition = this.targetWidth / 2 - this.stepWidth / 2 + this.targetOffsetLeft;
        this.stepAbsoluteLeft = this.targetWidth / 2 - this.stepWidth / 2 + this.targetAbsoluteLeft;
        this.adjustLeftPosition();
        this.adjustRightPosition();
        this.arrowPosition = 'top';
        this.adjustBottomPosition()
    }

    private setStyleTop() {
        this.topPosition = this.targetOffsetTop - DISTANCE_FROM_TARGET - this.stepHeight;
        this.arrowTopPosition = this.stepHeight;

        this.leftPosition = this.targetWidth / 2 - this.stepWidth / 2 + this.targetOffsetLeft;
        this.stepAbsoluteLeft = this.targetWidth / 2 - this.stepWidth / 2 + this.targetAbsoluteLeft;
        this.arrowLeftPosition = this.stepWidth / 2 - this.arrowSize;
        this.adjustLeftPosition();
        this.adjustRightPosition();
        this.arrowPosition = 'bottom';
        this.adjustTopPosition();
    }

    private adjustLeftPosition() {
        if (this.leftPosition < 0) {
            this.arrowLeftPosition = this.arrowLeftPosition + this.leftPosition - DEFAULT_DISTANCE_FROM_MARGIN_LEFT;
            this.leftPosition = DEFAULT_DISTANCE_FROM_MARGIN_LEFT;
        }
    }

    private adjustRightPosition() {
        let currentWindowWidth = document.body.clientWidth;
        if (this.stepAbsoluteLeft + this.stepWidth > currentWindowWidth) {
            let newLeftPos = this.leftPosition - (this.stepAbsoluteLeft + this.stepWidth + DEFAULT_DISTANCE_FROM_MARGIN_RIGHT - currentWindowWidth);
            let deltaLeftPosition = newLeftPos - this.leftPosition;

            this.leftPosition = newLeftPos;
            this.arrowLeftPosition = this.arrowLeftPosition - deltaLeftPosition;
        }
    }

    private adjustBottomPosition() {
        if (this.targetAbsoluteTop + this.stepHeight + this.arrowSize - this.targetHeight > document.body.clientHeight) {
            this.setStyleTop();
            this.stepsContainerService.setPosition(this.step, 'top');
        }
    }

    private adjustTopPosition() {
        if (this.targetAbsoluteTop - this.stepHeight - this.arrowSize < 0) {
            this.setStyleBottom();
            this.stepsContainerService.setPosition(this.step, 'bottom');
        }
    }

    private subscribeToResizeEvents(): Subscription {
        return this.eventListenerService.resizeEvent.subscribe(() => {
            this.drawStep();
        });
    }

    private getDimensionsByAspectRatio(width: number, height: number, aspectRatio: number) {
        let calcHeight = (width + height) / (1 + aspectRatio);
        let calcWidth = calcHeight * aspectRatio;
        return {
            width: calcWidth,
            height: calcHeight
        }
    }
    private adjustDimensions(width: number, height: number) {
        let area = width * height;
        let newWidth = width;
        let newHeight = height;
        if (width > STEP_MAX_WIDTH) {
            newWidth = STEP_MAX_WIDTH;
            newHeight = area / newWidth;
        }
        else if (width < STEP_MIN_WIDTH) {
            newWidth = STEP_MIN_WIDTH;
            newHeight = STEP_MIN_WIDTH / ASPECT_RATIO;
        }
        return {
            width: newWidth,
            height: newHeight
        }
    }

    ngOnDestroy() {
        this.subscriptions.forEach((subscription) => {
            subscription.unsubscribe();
        });
    }

}