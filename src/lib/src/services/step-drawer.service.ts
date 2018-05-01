import { Injectable, ComponentFactory, ComponentRef, ComponentFactoryResolver } from '@angular/core';
import { JoyrideStepComponent } from "../components/step/joyride-step.component";
import { JoyrideStep } from '../models/joyride-step.class';

@Injectable()
export class StepDrawerService {

    constructor(
        private readonly componentFactoryResolver: ComponentFactoryResolver) { }

    draw(step: JoyrideStep) {
        const factory: ComponentFactory<JoyrideStepComponent> = this.componentFactoryResolver.resolveComponentFactory(JoyrideStepComponent);
        const ref: ComponentRef<JoyrideStepComponent> = step.targetViewContainer.createComponent(factory);
        const instance: JoyrideStepComponent = ref.instance;
        instance.step = step;
        ref.changeDetectorRef.detectChanges();
        step.stepInstance = instance;
    }

}