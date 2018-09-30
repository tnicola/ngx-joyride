import { Component, Input, AfterViewInit, ViewEncapsulation, OnInit, OnDestroy, ViewContainerRef, ElementRef, ViewChild, Renderer2, Injector, TemplateRef, Inject } from "@angular/core";
import { JoyrideStep } from "../../models/joyride-step.class";
import { JoyrideStepService, ARROW_SIZE, DISTANCE_FROM_TARGET, IJoyrideStepService } from "../../services/joyride-step.service";
import { JoyrideStepsContainerService } from "../../services/joyride-steps-container.service";
import { EventListenerService } from "../../services/event-listener.service";
import { Subscription } from "rxjs";
import { DocumentService } from "../../services/document.service";
import { JoyrideOptionsService } from "../../services/joyride-options.service";
import { LoggerService } from "../../services/logger.service";
import { TemplatesService } from "../../services/templates.service";

const STEP_MIN_WIDTH = 200;
const STEP_MAX_WIDTH = 400;
const STEP_HEIGHT = 200;
const ASPECT_RATIO = 1.212;
const DEFAULT_DISTANCE_FROM_MARGIN_TOP = 2;
const DEFAULT_DISTANCE_FROM_MARGIN_LEFT = 2;
const DEFAULT_DISTANCE_FROM_MARGIN_BOTTOM = 5;
const DEFAULT_DISTANCE_FROM_MARGIN_RIGHT = 5;

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
    showArrow: boolean = true;
    arrowPosition: string;
    arrowLeftPosition: number;
    arrowTopPosition: number;
    title: string;
    text: string;
    counter: string;
    isCounterVisible: boolean;
    isPrevButtonVisible: boolean;
    themeColor: string;
    customContent: TemplateRef<any>;
    customPrevButton: TemplateRef<any>;
    customNextButton: TemplateRef<any>;
    customDoneButton: TemplateRef<any>;
    customCounter: TemplateRef<any>;
    counterData: any;
    ctx: Object;

    private arrowSize: number = ARROW_SIZE;
    private stepAbsoluteLeft: number;
    private stepAbsoluteTop: number;
    private targetWidth: number;
    targetHeight: number;
    private targetAbsoluteLeft: number;
    private targetAbsoluteTop: number;

    private subscriptions: Subscription[] = [];
    joyrideStepService: IJoyrideStepService;

    private positionAlreadyFixed: boolean;
    private documentHeight: number;

    @Input() step?: JoyrideStep;
    @ViewChild('stepHolder') stepHolder: ElementRef;
    @ViewChild('stepContainer') stepContainer: ElementRef;

    constructor(
        private injector: Injector,
        private readonly stepsContainerService: JoyrideStepsContainerService,
        private readonly eventListenerService: EventListenerService,
        private readonly documentService: DocumentService,
        private readonly renderer: Renderer2,
        private readonly logger: LoggerService,
        private readonly optionsService: JoyrideOptionsService,
        private readonly templateService: TemplatesService
    ) { }


    ngOnInit(): void {
        // Need to Inject here otherwise you will obtain a circular dependency
        this.joyrideStepService = this.injector.get(JoyrideStepService)

        this.documentHeight = this.documentService.getDocumentHeight();
        this.subscriptions.push(this.subscribeToResizeEvents());
        this.title = this.step.title;
        this.text = this.step.text;

        this.setCustomTemplates()

        this.counter = this.getCounter();
        this.isCounterVisible = this.optionsService.isCounterVisible();
        this.isPrevButtonVisible = this.optionsService.isPrevButtonVisible();
        this.themeColor = this.optionsService.getThemeColor();
    }

    ngAfterViewInit() {
        if (this.isCustomized()) {
            this.stepWidth = this.stepContainer.nativeElement.clientWidth;
            this.stepHeight = this.stepContainer.nativeElement.clientHeight;
        }
        else {
            this.renderer.setStyle(this.stepContainer.nativeElement, "max-width", STEP_MAX_WIDTH + 'px');
            let dimensions = this.getDimensionsByAspectRatio(this.stepContainer.nativeElement.clientWidth, this.stepContainer.nativeElement.clientHeight, ASPECT_RATIO);
            dimensions = this.adjustDimensions(dimensions.width, dimensions.height);
            this.stepWidth = dimensions.width;
            this.stepHeight = dimensions.height;
            this.renderer.setStyle(this.stepContainer.nativeElement, "width", this.stepWidth + 'px');
            this.renderer.setStyle(this.stepContainer.nativeElement, "height", this.stepHeight + 'px');
        }
        this.drawStep();
    }

    private isCustomized() {
        return this.step.stepContent
            || this.templateService.getCounter()
            || this.templateService.getPrevButton()
            || this.templateService.getNextButton()
            || this.templateService.getDoneButton()
    }

    private drawStep() {
        let position = this.step.isElementOrAncestorFixed ? 'fixed' : 'absolute';
        this.renderer.setStyle(this.stepHolder.nativeElement, "position", position);
        this.renderer.setStyle(this.stepHolder.nativeElement, "transform", this.step.transformCssStyle);
        this.targetWidth = this.step.targetViewContainer.element.nativeElement.getBoundingClientRect().width;
        this.targetHeight = this.step.targetViewContainer.element.nativeElement.getBoundingClientRect().height;
        this.targetAbsoluteLeft = position === 'fixed' ?
            this.documentService.getElementFixedLeft(this.step.targetViewContainer.element)
            : this.documentService.getElementAbsoluteLeft(this.step.targetViewContainer.element);
        this.targetAbsoluteTop = position === 'fixed' ?
            this.documentService.getElementFixedTop(this.step.targetViewContainer.element)
            : this.documentService.getElementAbsoluteTop(this.step.targetViewContainer.element);
        this.setStepStyle();
    }

    private getCounter(): string {
        let stepPosition = this.stepsContainerService.getStepPosition(this.step);
        let numberOfSteps = this.stepsContainerService.getNumberOfSteps();
        this.counterData = { step: stepPosition, total: numberOfSteps };
        return stepPosition + '/' + numberOfSteps;
    }

    private setCustomTemplates() {
        this.customContent = this.step.stepContent;
        this.ctx = this.step.stepContentParams;
        this.customPrevButton = this.templateService.getPrevButton();
        this.customNextButton = this.templateService.getNextButton();
        this.customDoneButton = this.templateService.getDoneButton();
        this.customCounter = this.templateService.getCounter();
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
            case 'right': {
                this.setStyleRight();
                break;
            }
            case 'left': {
                this.setStyleLeft();
                break;
            }
            case 'center': {
                this.setStyleCenter();
                break;
            }
            default: {
                this.setStyleBottom();
            }
        }
    }

    private setStyleTop() {
        this.stepsContainerService.setPosition(this.step, 'top');
        this.topPosition = this.targetAbsoluteTop - DISTANCE_FROM_TARGET - this.stepHeight;
        this.stepAbsoluteTop = this.targetAbsoluteTop - DISTANCE_FROM_TARGET - this.stepHeight;
        this.arrowTopPosition = this.stepHeight;

        this.leftPosition = this.targetWidth / 2 - this.stepWidth / 2 + this.targetAbsoluteLeft;
        this.stepAbsoluteLeft = this.targetWidth / 2 - this.stepWidth / 2 + this.targetAbsoluteLeft;
        this.arrowLeftPosition = this.stepWidth / 2 - this.arrowSize;
        this.adjustLeftPosition();
        this.adjustRightPosition();
        this.arrowPosition = 'bottom';
        this.autofixTopPosition();
    }

    private setStyleRight() {
        this.stepsContainerService.setPosition(this.step, 'right');
        this.topPosition = this.targetAbsoluteTop + this.targetHeight / 2 - this.stepHeight / 2;
        this.stepAbsoluteTop = this.targetAbsoluteTop + this.targetHeight / 2 - this.stepHeight / 2;
        this.arrowTopPosition = this.stepHeight / 2 - this.arrowSize;

        this.leftPosition = this.targetAbsoluteLeft + this.targetWidth + DISTANCE_FROM_TARGET;
        this.stepAbsoluteLeft = this.targetAbsoluteLeft + this.targetWidth + DISTANCE_FROM_TARGET;
        this.arrowLeftPosition = - this.arrowSize;
        this.adjustTopPosition();
        this.adjustBottomPosition();
        this.arrowPosition = 'left';
        this.autofixRightPosition();
    }

    private setStyleBottom() {
        this.stepsContainerService.setPosition(this.step, 'bottom');
        this.topPosition = this.targetAbsoluteTop + this.targetHeight + DISTANCE_FROM_TARGET;
        this.stepAbsoluteTop = this.targetAbsoluteTop + this.targetHeight + DISTANCE_FROM_TARGET;
        this.arrowTopPosition = -this.arrowSize;

        this.arrowLeftPosition = this.stepWidth / 2 - this.arrowSize;
        this.leftPosition = this.targetWidth / 2 - this.stepWidth / 2 + this.targetAbsoluteLeft;
        this.stepAbsoluteLeft = this.targetWidth / 2 - this.stepWidth / 2 + this.targetAbsoluteLeft;
        this.adjustLeftPosition();
        this.adjustRightPosition();
        this.arrowPosition = 'top';
        this.autofixBottomPosition()
    }

    private setStyleLeft() {
        this.stepsContainerService.setPosition(this.step, 'left');
        this.topPosition = this.targetAbsoluteTop + this.targetHeight / 2 - this.stepHeight / 2;
        this.stepAbsoluteTop = this.targetAbsoluteTop + this.targetHeight / 2 - this.stepHeight / 2;
        this.arrowTopPosition = this.stepHeight / 2 - this.arrowSize;

        this.leftPosition = this.targetAbsoluteLeft - this.stepWidth - DISTANCE_FROM_TARGET;
        this.stepAbsoluteLeft = this.targetAbsoluteLeft - this.stepWidth - DISTANCE_FROM_TARGET;
        this.arrowLeftPosition = this.stepWidth;
        this.adjustTopPosition();
        this.adjustBottomPosition();
        this.arrowPosition = 'right';
        this.autofixLeftPosition();
    }

    private setStyleCenter() {
        this.renderer.setStyle(this.stepHolder.nativeElement, "position", "fixed");
        this.renderer.setStyle(this.stepHolder.nativeElement, "top", "50%");
        this.renderer.setStyle(this.stepHolder.nativeElement, "left", "50%");
        this.renderer.setStyle(this.stepHolder.nativeElement, "transform", `translate(-${this.stepWidth / 2}px, -${this.stepHeight / 2}px)`);
        this.showArrow = false;
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

    private adjustTopPosition() {
        if (this.stepAbsoluteTop < 0) {
            this.arrowTopPosition = this.arrowTopPosition + this.topPosition - DEFAULT_DISTANCE_FROM_MARGIN_TOP;
            this.topPosition = DEFAULT_DISTANCE_FROM_MARGIN_TOP;
        }
    }

    private adjustBottomPosition() {
        if (this.stepAbsoluteTop + this.stepHeight > this.documentHeight) {
            let newTopPos = this.topPosition - (this.stepAbsoluteTop + this.stepHeight + DEFAULT_DISTANCE_FROM_MARGIN_BOTTOM - this.documentHeight);
            let deltaTopPosition = newTopPos - this.topPosition;

            this.topPosition = newTopPos;
            this.arrowTopPosition = this.arrowTopPosition - deltaTopPosition;
        }
    }

    private autofixTopPosition() {
        if (this.positionAlreadyFixed) {
            this.logger.warn("No step positions found for this step. The step will be centered.");
        } else if (this.targetAbsoluteTop - this.stepHeight - this.arrowSize < 0) {
            this.positionAlreadyFixed = true;
            this.setStyleRight();
        }
    }

    private autofixRightPosition() {
        if (this.targetAbsoluteLeft + this.targetWidth + this.stepWidth + this.arrowSize > document.body.clientWidth) {
            this.setStyleBottom();
        }
    }

    private autofixBottomPosition() {
        if (this.targetAbsoluteTop + this.stepHeight + this.arrowSize + this.targetHeight > this.documentHeight) {
            this.setStyleLeft();
        }
    }

    private autofixLeftPosition() {
        if (this.targetAbsoluteLeft - this.stepWidth - this.arrowSize < 0) {
            this.setStyleTop();
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