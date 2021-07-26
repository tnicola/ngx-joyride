import {
    JoyrideOptionsService,
    STEP_DEFAULT_POSITION,
    DEFAULT_THEME_COLOR,
    DEFAULT_TIMEOUT_BETWEEN_STEPS, DEFAULT_TIMEOUT_AFTER_NAVIGATION
} from './joyride-options.service';
import { TestBed } from '@angular/core/testing';
import { JoyrideOptions } from '../models/joyride-options.class';
import { of } from 'rxjs';

describe('JoyrideOptionsService', () => {
    let optionsService: JoyrideOptionsService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [JoyrideOptionsService]
        });
    });

    beforeEach(() => {
        optionsService = TestBed.get(JoyrideOptionsService);
    });

    describe('setOptions', () => {
        it('should set the stepDefaultPosition as the one passed as parameter', () => {
            optionsService.setOptions({
                steps: [],
                stepDefaultPosition: 'right'
            });

            expect(optionsService.getStepDefaultPosition()).toBe('right');
        });
        it('should set the stepDefaultPosition as the default one, if none is passed', () => {
            optionsService.setOptions({ steps: [] });

            expect(optionsService.getStepDefaultPosition()).toBe(
                STEP_DEFAULT_POSITION
            );
        });
        it('should set the theme colour as the one passed by parameter', () => {
            optionsService.setOptions({ steps: [], themeColor: '#321212' });

            expect(optionsService.getThemeColor()).toBe('#321212');
        });
        it('should set the theme colour as the one passed by parameter', () => {
            optionsService.setOptions({ steps: [] });

            expect(optionsService.getThemeColor()).toBe(DEFAULT_THEME_COLOR);
        });
        it('should set the logs enabled to false if false is passed by parameter', () => {
            optionsService.setOptions({ steps: [], logsEnabled: false });

            expect(optionsService.areLogsEnabled()).toBe(false);
        });
        it('should set logsEnabled to false if none is passed by parameter', () => {
            optionsService.setOptions({ steps: [] });

            expect(optionsService.areLogsEnabled()).toBe(false);
        });
        it('should set the showCounter to false if false is passed by parameter', () => {
            optionsService.setOptions({ steps: [], showCounter: false });

            expect(optionsService.isCounterVisible()).toBe(false);
        });
        it('should set the showCounter to true if no parameter is passed', () => {
            optionsService.setOptions({ steps: [] });

            expect(optionsService.isCounterVisible()).toBe(true);
        });
        it('should set the showPrevButton to false if false is passed by parameter', () => {
            optionsService.setOptions({ steps: [], showPrevButton: false });

            expect(optionsService.isPrevButtonVisible()).toBe(false);
        });
        it('should set the showPrevButton to true if no parameter is passed', () => {
            optionsService.setOptions({ steps: [] });

            expect(optionsService.isPrevButtonVisible()).toBe(true);
        });
    });

    describe('getBackdropColor()', () => {
        it('should return the theme colour in a RGB format', () => {
            optionsService.setOptions({ steps: [], themeColor: '#a167FE' });

            expect(optionsService.getBackdropColor()).toBe('161, 103, 254');
        });
    });

    describe('getStepsOrder()', () => {
        it('should return the steps, as the user passed them', () => {
            optionsService.setOptions({ steps: ['one', 'two', 'three'] });

            expect(optionsService.getStepsOrder()).toEqual(
                jasmine.objectContaining(['one', 'two', 'three'])
            );
        });
    });

    describe('isPrevButtonVisible', () => {
        it('should return true if showPrevButton is set to true', () => {
            let step = new JoyrideOptions();
            step.showPrevButton = true;
            optionsService.setOptions(step);

            expect(optionsService.isPrevButtonVisible()).toBe(true);
        });
        it('should return false if showPrevButton is set to false', () => {
            let step = new JoyrideOptions();
            step.showPrevButton = false;
            optionsService.setOptions(step);

            expect(optionsService.isPrevButtonVisible()).toBe(false);
        });
    });

    describe('getFirstStep', () => {
        it('should return the firstStep long name if it has been set into the options', () => {
            let step = new JoyrideOptions();
            step.startWith = 'joy@mypage';
            optionsService.setOptions(step);

            expect(optionsService.getFirstStep()).toBe('joy@mypage');
        });

        it('should return undefined if the step has not been set into the options', () => {
            let step = new JoyrideOptions();
            optionsService.setOptions(step);

            expect(optionsService.getFirstStep()).toBe(undefined);
        });
    });

    describe('getWaitingTime()', () => {
        it('should return waiting timeout if it has been set into the options', () => {
            const stepOption = new JoyrideOptions();
            stepOption.waitingTime = 124;
            optionsService.setOptions(stepOption);

            expect(optionsService.getWaitingTime()).toBe(124);
        });

        it('should return the default waiting time no parameter has been set', () => {
            const stepOption = new JoyrideOptions();
            optionsService.setOptions(stepOption);

            expect(optionsService.getWaitingTime()).toBe(
                DEFAULT_TIMEOUT_BETWEEN_STEPS
            );
        });
    });

    describe('getWaitingTimeAfterNavigation()', () => {
        it('should return waiting timeout if it has been set into the options', () => {
            const stepOption = new JoyrideOptions();
            stepOption.waitingTimeAfterNavigation = 124;
            optionsService.setOptions(stepOption);

            expect(optionsService.getWaitingTimeAfterNavigation()).toBe(124);
        });

        it('should return the default waiting time no parameter has been set', () => {
            const stepOption = new JoyrideOptions();
            optionsService.setOptions(stepOption);

            expect(optionsService.getWaitingTimeAfterNavigation()).toBe(
                DEFAULT_TIMEOUT_AFTER_NAVIGATION
            );
        });
    });

    describe('getCustomTexts()', () => {
        it('should return the default texts by default', () => {
            const stepOption = new JoyrideOptions();
            optionsService.setOptions(stepOption);

            const customTexts = optionsService.getCustomTexts();

            customTexts.prev.subscribe(prev => expect(prev).toEqual('prev'));
            customTexts.next.subscribe(next => expect(next).toEqual('next'));
            customTexts.done.subscribe(done => expect(done).toEqual('done'));
            customTexts.close.subscribe(close => expect(close).toBeNull());
        });

        it('should return the custom texts when they have been set', () => {
            const stepOption = new JoyrideOptions();
            stepOption.customTexts = { prev: 'myPrev', done: of('myDone') };
            optionsService.setOptions(stepOption);

            const customTexts = optionsService.getCustomTexts();

            customTexts.prev.subscribe(prev => expect(prev).toEqual('myPrev'));
            customTexts.next.subscribe(next => expect(next).toEqual('next'));
            customTexts.done.subscribe(done => expect(done).toEqual('myDone'));
            customTexts.close.subscribe(close => expect(close).toBeNull());
        });
    });
});
