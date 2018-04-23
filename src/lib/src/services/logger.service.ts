import { Injectable } from '@angular/core';
import { JoyrideOptionsService } from './joyride-options.service';

@Injectable()
export class Logger {

    constructor(private readonly optionService: JoyrideOptionsService) { }

    debug(message?, data?) {
        if (this.optionService.areLogsEnabled) {
            console.debug(message, data);
        }
    }

    info(message?, data?) {
        if (this.optionService.areLogsEnabled) {
            console.info(message, data);
        }
    }

    warn(message?, data?) {
        if (this.optionService.areLogsEnabled) {
            console.warn(message, data);
        }
    }

    error(message?, data?) {
        if (this.optionService.areLogsEnabled) {
            console.error(message, data);
        }
    }

}