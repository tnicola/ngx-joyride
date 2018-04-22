import { Injectable } from "@angular/core";
import { JoyrideStep } from "../models/joyride-step.class";
import { Subject } from "rxjs/Subject";

@Injectable()
export class JoyrideStepsContainerService {
    private steps: JoyrideStep[];
    stepHasBeenModified: Subject<JoyrideStep> = new Subject<JoyrideStep>();

    constructor() {
        this.steps = [];
    }

    get(index: number): JoyrideStep {
        return this.steps[index];
    }

    getStepPosition(step: JoyrideStep): number{
        return this.getStepIndex(step) + 1;
    }

    addStep(step: JoyrideStep) {
        this.steps.push(step);
    }

    getNumberOfSteps() {
        return this.steps.length;
    }

    setPosition(step: JoyrideStep, position: string) {
        let index = this.getStepIndex(step);
        this.steps[index].position = position;
        this.stepHasBeenModified.next(this.steps[index]);
    }

    orderStepsByIndex() {
        this.steps = this.steps.sort((a, b) => {
            return a.stepNumber - b.stepNumber;
        })
    }

    private getStepIndex(step: JoyrideStep){
        return this.steps.indexOf(step);
    }
}