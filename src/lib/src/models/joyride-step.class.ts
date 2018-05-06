import { ViewContainerRef, TemplateRef } from "@angular/core";
import { JoyrideStepComponent } from "../components/step/joyride-step.component";

export class JoyrideStep {
    idSelector: string;
    stepNumber: number;
    position: string;
    title: string;
    text: string;
    stepContent: TemplateRef<any>;
    transformCssStyle: string;
    targetViewContainer: ViewContainerRef;
    stepInstance: JoyrideStepComponent;
}