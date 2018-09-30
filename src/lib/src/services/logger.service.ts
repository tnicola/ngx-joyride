import { Injectable } from '@angular/core';
import { JoyrideOptionsService } from './joyride-options.service';

const JOYRIDE = 'ngx-joyride:::';

@Injectable()
export class LoggerService {

    constructor(private readonly optionService: JoyrideOptionsService) { }

    debug(message?: string, data: any = "") {
        if (this.optionService.areLogsEnabled()) {
            console.debug(JOYRIDE + message, data);
        }
    }

    info(message?: string, data: any = "") {
        if (this.optionService.areLogsEnabled()) {
            console.info(JOYRIDE + message, data);
        }
    }

    warn(message?: string, data: any = "") {
        if (this.optionService.areLogsEnabled()) {
            console.warn(JOYRIDE + message, data);
        }
    }

    error(message?: string, data: any = "") {
        if (this.optionService.areLogsEnabled()) {
            console.error(JOYRIDE + message, data);
        }
    }

}