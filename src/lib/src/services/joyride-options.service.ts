import { Injectable } from "@angular/core";
import { JoyrideOptions } from "../models/joyride-options.class";

const DEFAULT_THEME_COLOR = "#3b5560";
const BACKDROP_DEFAULT_COLOR = DEFAULT_THEME_COLOR;
const BUTTONS_DEFAULT_COLOR = DEFAULT_THEME_COLOR;
const STEP_DEFAULT_POSITION = "bottom";

@Injectable()
export class JoyrideOptionsService {

    private backdropColor: string = BACKDROP_DEFAULT_COLOR;
    private buttonsColor: string = BUTTONS_DEFAULT_COLOR;
    private stepDefaultPosition: string = STEP_DEFAULT_POSITION;

    setOptions(options: JoyrideOptions) {
            this.stepDefaultPosition = options.stepDefaultPosition ? options.stepDefaultPosition : this.stepDefaultPosition;
    }

    getBackdropColor() {
        return this.hexToRgb(this.backdropColor);
    }

    getButtonsColor() {
        return this.buttonsColor;
    }

    getStepDefaultPosition() {
        return this.stepDefaultPosition;
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