import { Observable } from 'rxjs';

export class JoyrideOptions {
    steps: string[];
    startWith?: string;
    waitingTime?: number;
    stepDefaultPosition?: string;
    themeColor?: string;
    showCounter?: boolean;
    showPrevButton?: boolean;
    customTexts?: CustomTexts;
    logsEnabled?: boolean;
}

export class ICustomTexts {
    prev?;
    next?;
    done?;
    close?;
}

export class CustomTexts implements ICustomTexts{
    prev?: string | Observable<string>;
    next?: string | Observable<string>;
    done?: string | Observable<string>;
    close?: string | Observable<string>;
}
