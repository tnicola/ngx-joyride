import { Injectable } from '@angular/core';
import { JoyrideStepService } from "./joyride-step.service";
import { JoyrideOptionsService } from './joyride-options.service';
import { JoyrideOptions } from '../models/joyride-options.class';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/finally';
import { JoyrideStepInfo } from '../models/joyride-step-info.class';

@Injectable()
export class JoyrideService {

    private tourInProgress: boolean = false;
    private tour$: Observable<JoyrideStepInfo>;

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
            this.tour$ = this.stepService.startTour().finally(() => this.tourInProgress = false);
            this.tour$.subscribe();
        }
        return this.tour$;
    }

    isTourInProgress(): boolean {
        return this.tourInProgress;
    }

}