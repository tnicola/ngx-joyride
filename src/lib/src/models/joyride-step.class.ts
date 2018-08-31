import { ViewContainerRef, TemplateRef, EventEmitter } from "@angular/core";
import { JoyrideStepComponent } from "../components/step/joyride-step.component";

export class JoyrideStep {
    name: string;
    route: string;
    position: string;
    title: string;
    text: string;
    stepContent: TemplateRef<any>;
    stepContentParams: Object;
    nextClicked: EventEmitter<any>;
    prevCliked: EventEmitter<any>;
    tourDone: EventEmitter<any>;
    transformCssStyle: string;
    isElementOrAncestorFixed: boolean;
    targetViewContainer: ViewContainerRef;
    stepInstance: JoyrideStepComponent;
}