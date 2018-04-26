import { Injectable } from "@angular/core";
import { JoyrideOptions } from "../models/joyride-options.class";

const DEFAULT_THEME_COLOR = "#3b5560";
const THEME_COLOR = DEFAULT_THEME_COLOR;
const STEP_DEFAULT_POSITION = "bottom";

@Injectable()
export class JoyrideOptionsService {

    private themeColor: string = THEME_COLOR;
    private stepDefaultPosition: string = STEP_DEFAULT_POSITION;
    private logsEnabled: boolean = true;
    private showCounter: boolean = true;

    setOptions(options: JoyrideOptions) {
            this.stepDefaultPosition = options.stepDefaultPosition ? options.stepDefaultPosition : this.stepDefaultPosition;
            this.logsEnabled = typeof options.logsEnabled !== 'undefined' ? options.logsEnabled : this.logsEnabled;
            this.showCounter = typeof options.showCounter !== 'undefined' ? options.showCounter : this.showCounter;
            this.themeColor = options.themeColor ? options.themeColor : this.themeColor;
    }

    getBackdropColor() {
        return this.hexToRgb(this.themeColor);
    }

    getThemeColor() {
        return this.themeColor;
    }

    getStepDefaultPosition() {
        return this.stepDefaultPosition;
    }

    areLogsEnabled() {
        return this.logsEnabled;
    }

    isCounterVisible(){
        return this.showCounter;
    }

    private hexToRgb(hex: any): string {
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, (m: any, r: any, g: any, b: any) => {
            return r + r + g + g + b + b;
        });

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ?
            `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : null;
    }
}