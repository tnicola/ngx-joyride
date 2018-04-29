import { Injectable } from '@angular/core';
import { JoyrideOptionsService } from './joyride-options.service';

@Injectable()
export class Logger {

    constructor(private readonly optionService: JoyrideOptionsService) { }

    debug(message? : string, data? : any) {
        if (this.optionService.areLogsEnabled) {
            console.debug(message, data);
        }
    }

    info(message? : string, data? : any) {
        if (this.optionService.areLogsEnabled) {
            console.info(message, data);
        }
    }

    warn(message? : string, data? : any) {
        if (this.optionService.areLogsEnabled) {
            console.warn(message, data);
        }
    }

    error(message? : string, data? : any) {
        if (this.optionService.areLogsEnabled) {
            console.error(message, data);
        }
    }

}