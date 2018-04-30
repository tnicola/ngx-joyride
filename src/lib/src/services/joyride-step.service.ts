import { Injectable, ComponentRef, ComponentFactory, ComponentFactoryResolver } from "@angular/core";
import { JoyrideStep } from "../models/joyride-step.class";
import { JoyrideBackdropService } from "../services/joyride-backdrop.service";
import { EventListenerService } from "../services/event-listener.service";
import { JoyrideStepsContainerService } from "../services/joyride-steps-container.service";
import { DocumentService } from "../services/document.service";
import { StepDrawerService } from "./step-drawer.service";
import { DomRefService } from "./dom.service";
import { NO_POSITION } from "../directives/joyride.directive";
import { JoyrideOptionsService } from "./joyride-options.service";

const SCROLLBAR_SIZE = 20;
export const DISTANCE_FROM_TARGET = 15;
export const ARROW_SIZE = 10;

@Injectable()
export class JoyrideStepService {
    private currentStepIndex: number;
    private currentStep: JoyrideStep;

    private winTopPosition: number = 0;
    private winBottomPosition: number = 0;

    constructor(
        private readonly componentFactoryResolver: ComponentFactoryResolver,
        private readonly backDropService: JoyrideBackdropService,
        private readonly eventListener: EventListenerService,
        private readonly stepsContainerService: JoyrideStepsContainerService,
        private readonly documentService: DocumentService,
        private readonly DOMService: DomRefService,
        private readonly stepDrawerService: StepDrawerService,
        private readonly optionsService: JoyrideOptionsService
    ) {
        this.initViewportPositions();
        this.subscribeToScrollEvents();
        this.subscribeToResizeEvents();
    }

    private initViewportPositions(){
        this.winTopPosition = 0;
        this.winBottomPosition = this.DOMService.nativeWindow.innerHeight - SCROLLBAR_SIZE;
    }

    private subscribeToScrollEvents() {
        this.eventListener.startListeningScrollEvents();
        this.eventListener.scrollEvent.subscribe((scroll) => {
            this.winTopPosition = scroll.scrollY;
            this.winBottomPosition = this.winTopPosition + this.DOMService.nativeWindow.innerHeight - SCROLLBAR_SIZE;
            this.backDropService.redraw(scroll);
        });
    }

    private subscribeToResizeEvents() {
        this.eventListener.resizeEvent.subscribe(() => {
            this.backDropService.redrawTarget(this.currentStep.targetViewContainer);
        });
    }

    private drawStep(step: JoyrideStep) {
        step.position = step.position === NO_POSITION ? this.optionsService.getStepDefaultPosition() : step.position;
        this.stepDrawerService.draw(step);
    }

    startTour() {
        this.stepsContainerService.orderStepsByIndex();
        this.backDropService.start();
        this.currentStepIndex = 0;
        this.currentStep = this.stepsContainerService.get(this.currentStepIndex);
        this.showCurrentStep();
        this.eventListener.startListeningResizeEvents();
        this.subscribeToStepsUpdates()
    }

    close() {
        this.removeCurrentStep();
        this.DOMService.nativeWindow.scrollTo(0, 0);
        this.eventListener.stopListeningResizeEvents();
    }

    prev() {
        this.removeCurrentStep();
        this.currentStepIndex -= 1;
        this.currentStep = this.stepsContainerService.get(this.currentStepIndex);
        this.showCurrentStep();
    }

    next() {
        this.removeCurrentStep();
        this.currentStepIndex += 1;
        this.currentStep = this.stepsContainerService.get(this.currentStepIndex);
        this.showCurrentStep();
    }

    isFirstStep() {
        return this.currentStepIndex === 0;
    }

    isLastStep() {
        return this.currentStepIndex === this.stepsContainerService.getNumberOfSteps() - 1;
    }

    private subscribeToStepsUpdates() {
        this.stepsContainerService.stepHasBeenModified.subscribe((updatedStep) => {
            if (this.currentStep.stepNumber === updatedStep.stepNumber) {
                this.currentStep = updatedStep;
            }
        });
    }

    private showCurrentStep() {
        this.backDropService.show(this.currentStep.targetViewContainer, this.currentStep.idSelector);
        this.drawStep(this.currentStep);
        this.scrollIfTargetNotVisible();
    }

    private removeCurrentStep() {
        this.backDropService.hide();
        this.detachStep(this.currentStep);
    }

    private detachStep(step: JoyrideStep) {
        step.targetViewContainer.remove(step.stepNumber)
    }

    private scrollIfTargetNotVisible() {
        this.scrollWhenTargetIsHiddenBottom();
        this.scrollWhenTargetIsHiddenTop();
    }

    private scrollWhenTargetIsHiddenBottom() {
        let totalTargetBottom = this.getTotalTargetBottomPosition();
        if (totalTargetBottom > this.winBottomPosition) {
            this.DOMService.nativeWindow.scrollBy(0, totalTargetBottom - this.winBottomPosition);
        }
    }

    private scrollWhenTargetIsHiddenTop() {
        let totalTargetTop = this.getTotalTargetTopPosition();
        if (totalTargetTop < this.winTopPosition) {
            this.DOMService.nativeWindow.scrollBy(0, totalTargetTop - this.winTopPosition);
        }
    }

    private getTotalTargetBottomPosition(): number {
        let targetAbsoluteTop = this.documentService.getElementAbsoluteTop(this.currentStep.targetViewContainer.element);
        if (this.currentStep.position === 'top') {
            return targetAbsoluteTop + this.currentStep.stepInstance.targetHeight;
        } else if (this.currentStep.position === 'bottom') {
            return targetAbsoluteTop + this.currentStep.stepInstance.targetHeight + this.currentStep.stepInstance.stepHeight + ARROW_SIZE + DISTANCE_FROM_TARGET;
        }
    }

    private getTotalTargetTopPosition() {
        let targetAbsoluteTop = this.documentService.getElementAbsoluteTop(this.currentStep.targetViewContainer.element);
        if (this.currentStep.position === 'top') {
            return targetAbsoluteTop - (this.currentStep.stepInstance.stepHeight + ARROW_SIZE + DISTANCE_FROM_TARGET);
        } else if (this.currentStep.position === 'bottom') {
            return targetAbsoluteTop;
        }
    }

}