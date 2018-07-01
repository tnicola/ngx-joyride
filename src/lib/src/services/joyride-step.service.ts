import { Injectable, ComponentRef, ComponentFactory, ComponentFactoryResolver, assertPlatform } from "@angular/core";
import { JoyrideStep } from "../models/joyride-step.class";
import { JoyrideBackdropService } from "../services/joyride-backdrop.service";
import { EventListenerService } from "../services/event-listener.service";
import { JoyrideStepsContainerService } from "../services/joyride-steps-container.service";
import { DocumentService } from "../services/document.service";
import { StepDrawerService } from "./step-drawer.service";
import { DomRefService } from "./dom.service";
import { NO_POSITION } from "../directives/joyride.directive";
import { JoyrideOptionsService } from "./joyride-options.service";
import { Router } from '@angular/router';

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
        private readonly optionsService: JoyrideOptionsService,
        private readonly router: Router
    ) {
        this.initViewportPositions();
        this.subscribeToScrollEvents();
        this.subscribeToResizeEvents();
    }

    private initViewportPositions() {
        this.winTopPosition = 0;
        this.winBottomPosition = this.DOMService.getNativeWindow().innerHeight - SCROLLBAR_SIZE;
    }

    private subscribeToScrollEvents() {
        this.eventListener.startListeningScrollEvents();
        this.eventListener.scrollEvent.subscribe((scroll) => {
            this.winTopPosition = scroll.scrollY;
            this.winBottomPosition = this.winTopPosition + this.DOMService.getNativeWindow().innerHeight - SCROLLBAR_SIZE;
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
        this.documentService.setDocumentHeight();
        if (this.optionsService.getFirstStepRoute()) {
            this.router.navigate([this.optionsService.getFirstStepRoute()]);
        }
        this.currentStepIndex = 0;
        this.showCurrentStep();
        this.eventListener.startListeningResizeEvents();
        this.subscribeToStepsUpdates();
    }

    close() {
        this.removeCurrentStep();
        this.currentStep.tourDone.emit();
        this.DOMService.getNativeWindow().scrollTo(0, 0);
        this.eventListener.stopListeningResizeEvents();
    }

    prev() {
        this.removeCurrentStep();
        this.currentStepIndex -= 1;
        this.currentStep.prevCliked.emit();
        if (this.currentStep.prevStepRoute) {
            this.router.navigate([this.currentStep.prevStepRoute]);
        }
        this.showCurrentStep();
    }

    next() {
        this.removeCurrentStep();
        this.currentStepIndex += 1;
        this.currentStep.nextClicked.emit();
        if (this.currentStep.nextStepRoute) {
            this.router.navigate([this.currentStep.nextStepRoute]);
        }
        this.showCurrentStep();
    }

    isFirstStep() {
        return this.currentStepIndex === 0;
    }

    isLastStep() {
        return !this.currentStep.nextStepName;
    }

    private subscribeToStepsUpdates() {
        this.stepsContainerService.stepHasBeenModified.subscribe((updatedStep) => {
            if (this.currentStep.id === updatedStep.id) {
                this.currentStep = updatedStep;
            }
        });
    }

    private showCurrentStep() {
        setTimeout(() => {
            this.stepsContainerService.initSteps();
            this.currentStep = this.stepsContainerService.get(this.currentStepIndex);
            this.backDropService.show(this.currentStep.targetViewContainer);
            this.drawStep(this.currentStep);
            this.scrollIfTargetNotVisible();
        }, 1)
    }

    private removeCurrentStep() {
        this.backDropService.hide();
        this.detachStep(this.currentStep);
    }

    private detachStep(step: JoyrideStep) {
        step.targetViewContainer.remove();
    }

    private scrollIfTargetNotVisible() {
        this.scrollWhenTargetIsHiddenBottom();
        this.scrollWhenTargetIsHiddenTop();
    }

    private scrollWhenTargetIsHiddenBottom() {
        let totalTargetBottom = this.getTotalTargetBottomPosition();
        if (totalTargetBottom > this.winBottomPosition) {
            this.DOMService.getNativeWindow().scrollBy(0, totalTargetBottom - this.winBottomPosition);
        }
    }

    private scrollWhenTargetIsHiddenTop() {
        let totalTargetTop = this.getTotalTargetTopPosition();
        if (totalTargetTop < this.winTopPosition) {
            this.DOMService.getNativeWindow().scrollBy(0, totalTargetTop - this.winTopPosition);
        }
    }

    private getTotalTargetBottomPosition(): number {
        let targetAbsoluteTop = this.documentService.getElementAbsoluteTop(this.currentStep.targetViewContainer.element);
        if (this.currentStep.position === 'top') {
            return targetAbsoluteTop + this.currentStep.stepInstance.targetHeight;
        } else if (this.currentStep.position === 'bottom') {
            return targetAbsoluteTop + this.currentStep.stepInstance.targetHeight + this.currentStep.stepInstance.stepHeight + ARROW_SIZE + DISTANCE_FROM_TARGET;
        } else if (this.currentStep.position === 'right' || this.currentStep.position === 'left') {
            return Math.max(targetAbsoluteTop + this.currentStep.stepInstance.targetHeight,
                targetAbsoluteTop + this.currentStep.stepInstance.targetHeight / 2 + this.currentStep.stepInstance.stepHeight / 2);
        }
    }

    private getTotalTargetTopPosition() {
        let targetAbsoluteTop = this.documentService.getElementAbsoluteTop(this.currentStep.targetViewContainer.element);
        if (this.currentStep.position === 'top') {
            return targetAbsoluteTop - (this.currentStep.stepInstance.stepHeight + ARROW_SIZE + DISTANCE_FROM_TARGET);
        } else if (this.currentStep.position === 'bottom') {
            return targetAbsoluteTop;
        } else if (this.currentStep.position === 'right' || this.currentStep.position === 'left') {
            return Math.min(targetAbsoluteTop, targetAbsoluteTop + this.currentStep.stepInstance.targetHeight / 2 - this.currentStep.stepInstance.stepHeight / 2);
        }
    }

}