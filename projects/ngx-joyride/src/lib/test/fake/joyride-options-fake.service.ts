import { Injectable } from '@angular/core';
import { IJoyrideOptionsService } from '../../services/joyride-options.service';

@Injectable()
export class JoyrideOptionsServiceFake implements IJoyrideOptionsService {
    setOptions: jasmine.Spy = jasmine.createSpy('setOptions');
    getBackdropColor: jasmine.Spy = jasmine.createSpy('getBackdropColor');
    getThemeColor: jasmine.Spy = jasmine.createSpy('getThemeColor');
    getStepDefaultPosition: jasmine.Spy = jasmine.createSpy('getStepDefaultPosition');
    areLogsEnabled: jasmine.Spy = jasmine.createSpy('areLogsEnabled');
    isCounterVisible: jasmine.Spy = jasmine.createSpy('isCounterVisible');
    isPrevButtonVisible: jasmine.Spy = jasmine.createSpy('isPrevButtonVisible');
    getFirstStepRoute: jasmine.Spy = jasmine.createSpy('getFirstStepRoute');
    getStepsOrder: jasmine.Spy = jasmine.createSpy('getStepsOrder');
    getFirstStep: jasmine.Spy = jasmine.createSpy('getFirstStep');
    getWaitingTime: jasmine.Spy = jasmine.createSpy('getWaitingTime');
    getCustomTexts: jasmine.Spy = jasmine.createSpy('getCustomTexts');
}
