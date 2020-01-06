import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { JoyrideStepService } from './joyride-step.service';
import { JoyrideOptionsService } from './joyride-options.service';
import { JoyrideOptions } from '../models/joyride-options.class';
import { Observable, of } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { JoyrideStepInfo } from '../models/joyride-step-info.class';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class JoyrideService {
    private tourInProgress: boolean = false;
    private tour$: Observable<JoyrideStepInfo>;

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private readonly stepService: JoyrideStepService,
        private readonly optionsService: JoyrideOptionsService
    ) {}

    startTour(options?: JoyrideOptions): Observable<JoyrideStepInfo> {
        if (!isPlatformBrowser(this.platformId)) {
            return of(new JoyrideStepInfo());
        }
        if (!this.tourInProgress) {
            this.tourInProgress = true;
            if (options) {
                this.optionsService.setOptions(options);
            }
            this.tour$ = this.stepService.startTour().pipe(finalize(() => (this.tourInProgress = false)));
            this.tour$.subscribe();
        }
        return this.tour$;
    }

    closeTour(): void {
        if (this.isTourInProgress()) this.stepService.close();
    }

    isTourInProgress(): boolean {
        return this.tourInProgress;
    }
}
