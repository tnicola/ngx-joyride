import { Injectable } from '@angular/core';
import { JoyrideStepService } from "./joyride-step.service";
import { JoyrideOptionsService } from '../services/joyride-options.service';
import { JoyrideOptions } from '../models/joyride-options.class';
import { Observable } from 'rxjs';
import { JoyrideStepInfo } from '../models/joyride-step-info.class';

@Injectable()
export class JoyrideService {

    private tourInProgress: boolean = false;
    private tourSubscription$: Observable<JoyrideStepInfo>;

    constructor(
        private readonly stepService: JoyrideStepService,
        private readonly optionsService: JoyrideOptionsService
    ) { }

    startTour(options?: JoyrideOptions): Observable<JoyrideStepInfo> {
        if (!this.tourInProgress) {
            this.tourInProgress = true;
            if (options) {
                this.optionsService.setOptions(options);
            }
            this.tourSubscription$ = this.stepService.startTour().do(() => { }, () => { }, () => this.tourInProgress = false);
        }
        return this.tourSubscription$;
    }

    isTourInProgress(): boolean {
        return this.tourInProgress;
    }

}