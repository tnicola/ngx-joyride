import { Injectable } from '@angular/core';
import { JoyrideStep } from '../models/joyride-step.class';
import { Subject } from 'rxjs';
import { JoyrideOptionsService } from './joyride-options.service';
import { LoggerService } from './logger.service';
import { JoyrideError, JoyrideStepOutOfRange } from '../models/joyride-error.class';

const ROUTE_SEPARATOR = '@';

class Step {
    id: string;
    step: JoyrideStep;
}

export enum StepActionType {
    NEXT = 'NEXT',
    PREV = 'PREV'
}

@Injectable()
export class JoyrideStepsContainerService {
    private steps: Step[];
    private tempSteps: JoyrideStep[] = [];
    private currentStepIndex: number = -2;
    stepHasBeenModified: Subject<JoyrideStep> = new Subject<JoyrideStep>();

    constructor(private readonly stepOptions: JoyrideOptionsService, private readonly logger: LoggerService) {}

    private getFirstStepIndex(): number {
        let firstStep = this.stepOptions.getFirstStep();
        let stepIds = this.stepOptions.getStepsOrder();

        let index = stepIds.indexOf(firstStep);
        if (index < 0) {
            index = 0;
            if (firstStep !== undefined) this.logger.warn(`The step ${firstStep} does not exist. Check in your step list if it's present.`);
        }

        return index;
    }

    init() {
        this.logger.info('Initializing the steps array.');
        this.steps = [];
        this.currentStepIndex = this.getFirstStepIndex() - 1;
        let stepIds = this.stepOptions.getStepsOrder();
        stepIds.forEach(stepId => this.steps.push({ id: stepId, step: null }));
    }

    addStep(stepToAdd: JoyrideStep) {
        let stepExist = this.tempSteps.filter(step => step.name === stepToAdd.name).length > 0;
        if (!stepExist) {
            this.logger.info(`Adding step ${stepToAdd.name} to the steps list.`);
            this.tempSteps.push(stepToAdd);
        } else {
            let stepIndexToReplace = this.tempSteps.findIndex(step => step.name === stepToAdd.name);
            this.tempSteps[stepIndexToReplace] = stepToAdd;
        }
    }
    get(action: StepActionType): JoyrideStep {
        if (action === StepActionType.NEXT) this.currentStepIndex++;
        else this.currentStepIndex--;

        if (this.currentStepIndex < 0 || this.currentStepIndex >= this.steps.length)
            throw new JoyrideStepOutOfRange('The first or last step of the tour cannot be found!');

        const stepName = this.getStepName(this.steps[this.currentStepIndex].id);
        const index = this.tempSteps.findIndex(step => step.name === stepName);
        let stepFound = this.tempSteps[index];
        this.steps[this.currentStepIndex].step = stepFound;

        if (stepFound == null) {
            this.logger.warn(`Step ${this.steps[this.currentStepIndex].id} not found in the DOM. Check if it's hidden by *ngIf directive.`);
        }

        return stepFound;
    }

    getStepRoute(action: StepActionType) {
        let stepID: string;
        if (action === StepActionType.NEXT) {
            stepID = this.steps[this.currentStepIndex + 1] ? this.steps[this.currentStepIndex + 1].id : null;
        } else {
            stepID = this.steps[this.currentStepIndex - 1] ? this.steps[this.currentStepIndex - 1].id : null;
        }
        let stepRoute = stepID && stepID.includes(ROUTE_SEPARATOR) ? stepID.split(ROUTE_SEPARATOR)[1] : '';

        return stepRoute;
    }

    updatePosition(stepName: string, position: string) {
        let index = this.getStepIndex(stepName);
        if (this.steps[index].step) {
            this.steps[index].step.position = position;
            this.stepHasBeenModified.next(this.steps[index].step);
        } else {
            this.logger.warn(
                `Trying to modify the position of ${stepName} to ${position}. Step not found!Is this step located in a different route?`
            );
        }
    }
    getStepNumber(stepName: string): number {
        return this.getStepIndex(stepName) + 1;
    }

    getStepsCount() {
        let stepsOrder = this.stepOptions.getStepsOrder();
        return stepsOrder.length;
    }

    private getStepIndex(stepName: string): number {
        const index = this.steps
            .map(step => (step.id.includes(ROUTE_SEPARATOR) ? step.id.split(ROUTE_SEPARATOR)[0] : step.id))
            .findIndex(name => stepName === name);
        if (index === -1) throw new JoyrideError(`The step with name: ${stepName} does not exist in the step list.`);
        return index;
    }

    private getStepName(stepID: string): string {
        let stepName = stepID && stepID.includes(ROUTE_SEPARATOR) ? stepID.split(ROUTE_SEPARATOR)[0] : stepID;
        return stepName;
    }
}
