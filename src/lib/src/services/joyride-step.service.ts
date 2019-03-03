import { Injectable } from '@angular/core';
import { JoyrideStep } from '../models/joyride-step.class';
import { JoyrideBackdropService } from './joyride-backdrop.service';
import { EventListenerService } from './event-listener.service';
import { JoyrideStepsContainerService, StepActionType } from './joyride-steps-container.service';
import { DocumentService } from './document.service';
import { StepDrawerService } from './step-drawer.service';
import { DomRefService } from './dom.service';
import { NO_POSITION } from '../directives/joyride.directive';
import { JoyrideOptionsService } from './joyride-options.service';
import { Router } from '@angular/router';
import { ReplaySubject, Observable } from 'rxjs';
import { JoyrideStepInfo } from '../models/joyride-step-info.class';

const SCROLLBAR_SIZE = 20;
export const DISTANCE_FROM_TARGET = 15;
export const ARROW_SIZE = 10;

export interface IJoyrideStepService {
    startTour(): Observable<JoyrideStepInfo>;
    close(): any;
    prev(): any;
    next(): any;
}

@Injectable()
export class JoyrideStepService implements IJoyrideStepService {
    private currentStep: JoyrideStep;

    private winTopPosition: number = 0;
    private winBottomPosition: number = 0;
    private stepsObserver: ReplaySubject<JoyrideStepInfo> = new ReplaySubject<JoyrideStepInfo>();

    constructor(
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
        this.eventListener.scrollEvent.subscribe(scroll => {
            this.winTopPosition = scroll.scrollY;
            this.winBottomPosition = this.winTopPosition + this.DOMService.getNativeWindow().innerHeight - SCROLLBAR_SIZE;
            this.backDropService.redraw(this.currentStep, scroll);
        });
    }

    private subscribeToResizeEvents() {
        this.eventListener.resizeEvent.subscribe(() => {
            this.backDropService.redrawTarget(this.currentStep);
        });
    }

    private drawStep(step: JoyrideStep) {
        step.position = step.position === NO_POSITION ? this.optionsService.getStepDefaultPosition() : step.position;
        this.stepDrawerService.draw(step);
    }

    startTour(): Observable<JoyrideStepInfo> {
        this.stepsObserver = new ReplaySubject<JoyrideStepInfo>();
        this.stepsContainerService.init();
        this.documentService.setDocumentHeight();

        this.navigateToStepPage(StepActionType.NEXT);
        this.showStep(StepActionType.NEXT);
        this.eventListener.startListeningResizeEvents();
        this.subscribeToStepsUpdates();
        return this.stepsObserver.asObservable();
    }

    close() {
        this.removeCurrentStep();
        this.notifyTourIsFinished();
        this.DOMService.getNativeWindow().scrollTo(0, 0);
        this.eventListener.stopListeningResizeEvents();
        this.backDropService.remove();
    }

    prev() {
        this.removeCurrentStep();
        this.currentStep.prevCliked.emit();
        this.navigateToStepPage(StepActionType.PREV);
        this.showStep(StepActionType.PREV);
    }

    next() {
        this.removeCurrentStep();
        this.currentStep.nextClicked.emit();
        this.navigateToStepPage(StepActionType.NEXT);
        this.showStep(StepActionType.NEXT);
    }

    private navigateToStepPage(action: StepActionType) {
        let stepRoute = this.stepsContainerService.getStepRoute(action);
        if (stepRoute) {
            this.router.navigate([stepRoute]);
        }
    }

    private subscribeToStepsUpdates() {
        this.stepsContainerService.stepHasBeenModified.subscribe(updatedStep => {
            if (this.currentStep.name === updatedStep.name) {
                this.currentStep = updatedStep;
            }
        });
    }

    private showStep(actionType: StepActionType) {
        setTimeout(() => {
            this.currentStep = this.stepsContainerService.get(actionType);
            // Scroll the element to get it visible if it's in a scrollable element
            this.scrollIfElementBeyondOtherElements();
            this.backDropService.draw(this.currentStep);
            this.drawStep(this.currentStep);
            this.scrollIfStepAndTargetAreNotVisible();
            this.notifyStepClicked(actionType);
        }, 1);
    }

    private notifyStepClicked(actionType: StepActionType) {
        let stepInfo: JoyrideStepInfo = {
            number: this.stepsContainerService.getStepNumber(this.currentStep.name),
            name: this.currentStep.name,
            route: this.currentStep.route,
            actionType
        };
        this.stepsObserver.next(stepInfo);
    }

    private notifyTourIsFinished() {
        this.currentStep.tourDone.emit();
        this.stepsObserver.complete();
    }
    private removeCurrentStep() {
        this.stepDrawerService.remove(this.currentStep);
    }

    private scrollIfStepAndTargetAreNotVisible() {
        this.scrollWhenTargetOrStepAreHiddenBottom();
        this.scrollWhenTargetOrStepAreHiddenTop();
    }

    private scrollWhenTargetOrStepAreHiddenBottom() {
        let totalTargetBottom = this.getMaxTargetAndStepBottomPosition();
        if (totalTargetBottom > this.winBottomPosition) {
            this.DOMService.getNativeWindow().scrollBy(0, totalTargetBottom - this.winBottomPosition);
        }
    }

    private scrollWhenTargetOrStepAreHiddenTop() {
        let totalTargetTop = this.getMaxTargetAndStepTopPosition();
        if (totalTargetTop < this.winTopPosition) {
            this.DOMService.getNativeWindow().scrollBy(0, totalTargetTop - this.winTopPosition);
        }
    }

    private getMaxTargetAndStepBottomPosition(): number {
        let targetAbsoluteTop = this.documentService.getElementAbsoluteTop(this.currentStep.targetViewContainer.element);
        if (this.currentStep.position === 'top') {
            return targetAbsoluteTop + this.currentStep.stepInstance.targetHeight;
        } else if (this.currentStep.position === 'bottom') {
            return (
                targetAbsoluteTop +
                this.currentStep.stepInstance.targetHeight +
                this.currentStep.stepInstance.stepHeight +
                ARROW_SIZE +
                DISTANCE_FROM_TARGET
            );
        } else if (this.currentStep.position === 'right' || this.currentStep.position === 'left') {
            return Math.max(
                targetAbsoluteTop + this.currentStep.stepInstance.targetHeight,
                targetAbsoluteTop + this.currentStep.stepInstance.targetHeight / 2 + this.currentStep.stepInstance.stepHeight / 2
            );
        }
    }

    private getMaxTargetAndStepTopPosition() {
        let targetAbsoluteTop = this.documentService.getElementAbsoluteTop(this.currentStep.targetViewContainer.element);
        if (this.currentStep.position === 'top') {
            return targetAbsoluteTop - (this.currentStep.stepInstance.stepHeight + ARROW_SIZE + DISTANCE_FROM_TARGET);
        } else if (this.currentStep.position === 'bottom') {
            return targetAbsoluteTop;
        } else if (this.currentStep.position === 'right' || this.currentStep.position === 'left') {
            return Math.min(
                targetAbsoluteTop,
                targetAbsoluteTop + this.currentStep.stepInstance.targetHeight / 2 - this.currentStep.stepInstance.stepHeight / 2
            );
        }
    }

    private scrollIfElementBeyondOtherElements() {
        if (this.isElementBeyondOthers()) {
            this.documentService.scrollToTheTop(this.currentStep.targetViewContainer.element);
        }
        if (this.isElementBeyondOthers()) {
            this.documentService.scrollToTheBottom(this.currentStep.targetViewContainer.element);
        }
        if (this.isElementBeyondOthers() && this.documentService.isParentScrollable(this.currentStep.targetViewContainer.element)) {
            this.currentStep.targetViewContainer.element.nativeElement.scrollIntoView();
        }
    }

    private isElementBeyondOthers() {
        return this.documentService.isElementBeyondOthers(
            this.currentStep.targetViewContainer.element,
            this.currentStep.isElementOrAncestorFixed,
            'backdrop'
        );
    }
}
