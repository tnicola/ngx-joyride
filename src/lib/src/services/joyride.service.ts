import { Injectable } from '@angular/core';
import { JoyrideStepService } from "./joyride-step.service";
import { JoyrideOptionsService } from '../services/joyride-options.service';
import { JoyrideOptions } from '../models/joyride-options.class';

@Injectable()
export class JoyrideService {

    constructor(
        private readonly stepService: JoyrideStepService,
        private readonly optionsService: JoyrideOptionsService
    ) { }

    startTour(options?: JoyrideOptions) {
        if (options) {
            this.optionsService.setOptions(options);
        }
        this.stepService.startTour();
    }

}