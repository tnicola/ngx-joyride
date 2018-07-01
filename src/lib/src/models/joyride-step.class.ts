import { ViewContainerRef, TemplateRef, EventEmitter } from "@angular/core";
import { JoyrideStepComponent } from "../components/step/joyride-step.component";

export class JoyrideStep {
    id: string;
    name: string;
    route: string;
    prevStepName: string;
    prevStepRoute: string;
    nextStepName: string;
    nextStepRoute: string;
    position: string;
    title: string;
    text: string;
    stepContent: TemplateRef<any>;
    nextClicked: EventEmitter<any>;
    prevCliked: EventEmitter<any>;
    tourDone: EventEmitter<any>;
    transformCssStyle: string;
    targetViewContainer: ViewContainerRef;
    stepInstance: JoyrideStepComponent;
}