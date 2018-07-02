import { Injectable } from "@angular/core";
import { JoyrideStep } from "../models/joyride-step.class";
import { Subject } from "rxjs/Subject";
import { JoyrideOptionsService } from "./joyride-options.service";
import { JoyrideError } from "../models/joyride-error.class";

@Injectable()
export class JoyrideStepsContainerService {
    private steps: JoyrideStep[];
    private stepsOriginal: JoyrideStep[];
    stepHasBeenModified: Subject<JoyrideStep> = new Subject<JoyrideStep>();

    constructor(
        private readonly stepOptions: JoyrideOptionsService
    ) {
        this.stepsOriginal = [];
        this.steps = [];
    }

    get(index: number): JoyrideStep {
        return this.steps[index];
    }

    getStepRoute(index: number) {
        let stepsOrder = this.stepOptions.getStepsOrder();
        let stepName = stepsOrder[index];
        let stepRoute = stepName && stepName.includes('@') ? stepName.split('@')[1] : "";
        return stepRoute;
    }

    getStepPosition(step: JoyrideStep): number {
        return this.getStepIndex(step) + 1;
    }

    addStep(stepToAdd: JoyrideStep) {
        let stepExist = this.stepsOriginal.filter(step => step.id === stepToAdd.id).length > 0;
        if (!stepExist) this.stepsOriginal.push(stepToAdd);
        else {
            let stepIndexToReplace = this.stepsOriginal.findIndex(step => step.id === stepToAdd.id);
            this.stepsOriginal[stepIndexToReplace] = stepToAdd;
        }
    }

    getNumberOfSteps() {
        let stepsOrder = this.stepOptions.getStepsOrder();
        return stepsOrder.length;
    }

    setPosition(step: JoyrideStep, position: string) {
        let index = this.getStepIndex(step);
        this.steps[index].position = position;
        this.stepHasBeenModified.next(this.steps[index]);
    }

    initSteps() {
        this.steps = [];
        this.stepsOriginal.forEach((step) => this.steps.push({ ...step }));
        this.sortSteps();
    }

    private sortSteps() {
        let orderedSteps: JoyrideStep[] = [];
        let stepsOrder = this.stepOptions.getStepsOrder();

        stepsOrder.forEach((stepName) => {
            let step = this.steps.find((step) => step.id === stepName);
            if (step) orderedSteps.push(step);
        });

        this.steps = [...orderedSteps];
    }

    private getStepIndex(step: JoyrideStep) {
        return this.steps.indexOf(step);
    }
}