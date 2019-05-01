import { ViewContainerRef, TemplateRef, EventEmitter } from '@angular/core';
import { JoyrideStepComponent } from '../components/step/joyride-step.component';
import { ReplaySubject } from 'rxjs';

export class JoyrideStep {
    constructor() {
        this.title = new ReplaySubject<string>();
        this.text = new ReplaySubject<string>();
    }
    name: string;
    route: string;
    position: string;
    title: ReplaySubject<string>;
    text: ReplaySubject<string>;
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