import { Injectable } from "@angular/core";
import { JoyrideStep } from "../models/joyride-step.class";
import { Subject } from "rxjs/Subject";
import { JoyrideOptionsService } from "./joyride-options.service";
import { JoyrideError } from "../models/joyride-error.class";
import { Router } from "@angular/router";

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
        return this.stepsOriginal.length;
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
        let orderedSteps = [...this.steps];
        let firstStepName = this.stepOptions.getFirstStepName();
        orderedSteps[0] = this.steps.find(step => step.name === firstStepName);

        for (let i = 1; i < orderedSteps.length; i++) {
            let nextStep = this.steps.find(step => step.name === orderedSteps[i - 1].nextStepName && step.route === orderedSteps[i - 1].nextStepRoute);
            if (nextStep) {
                orderedSteps[i] = nextStep;
                orderedSteps[i].prevStepName = orderedSteps[i - 1].name;
                orderedSteps[i].prevStepRoute = orderedSteps[i - 1].route;
            }
        }

        this.steps = [...orderedSteps];
    }

    private getStepIndex(step: JoyrideStep) {
        return this.steps.indexOf(step);
    }
}