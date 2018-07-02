import { JoyrideOptionsService, STEP_DEFAULT_POSITION, DEFAULT_THEME_COLOR } from "./joyride-options.service";
import { TestBed } from "@angular/core/testing";

describe("JoyrideOptionsService", () => {
    let optionsService: JoyrideOptionsService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                JoyrideOptionsService
            ]
        });
    })

    beforeEach(() => {
        optionsService = TestBed.get(JoyrideOptionsService);
    });

    describe("setOptions", () => {
        it("should set the stepDefaultPosition as the one passed as parameter", () => {
            optionsService.setOptions({ steps: [], stepDefaultPosition: 'right' });

            expect(optionsService.getStepDefaultPosition()).toBe('right');
        });
        it("should set the stepDefaultPosition as the default one, if none is passed", () => {
            optionsService.setOptions({ steps: [] });

            expect(optionsService.getStepDefaultPosition()).toBe(STEP_DEFAULT_POSITION);
        });
        it("should set the theme colour as the one passed by parameter", () => {
            optionsService.setOptions({ steps: [], themeColor: '#321212' })

            expect(optionsService.getThemeColor()).toBe('#321212');
        });
        it("should set the theme colour as the one passed by parameter", () => {
            optionsService.setOptions({ steps: [] })

            expect(optionsService.getThemeColor()).toBe(DEFAULT_THEME_COLOR);
        });
        it("should set the logs enabled to false if false is passed by parameter", () => {
            optionsService.setOptions({ steps: [], logsEnabled: false })

            expect(optionsService.areLogsEnabled()).toBe(false);
        });
        it("should set logsEnabled to true if none is passed by parameter", () => {
            optionsService.setOptions({ steps: [] })

            expect(optionsService.areLogsEnabled()).toBe(true);
        });
        it("should set the showCounter to false if false is passed by parameter", () => {
            optionsService.setOptions({ steps: [], showCounter: false })

            expect(optionsService.isCounterVisible()).toBe(false);
        });
        it("should set the showCounter to true if no parameter is passed", () => {
            optionsService.setOptions({ steps: [] })

            expect(optionsService.isCounterVisible()).toBe(true);
        });
        it("should set the showPrevButton to false if false is passed by parameter", () => {
            optionsService.setOptions({ steps: [], showPrevButton: false })

            expect(optionsService.isPrevButtonVisible()).toBe(false);
        });
        it("should set the showPrevButton to true if no parameter is passed", () => {
            optionsService.setOptions({ steps: [] })

            expect(optionsService.isPrevButtonVisible()).toBe(true);
        });
    })

    describe('getBackdropColor()', () => {
        it("should return the theme colour in a RGB format", () => {
            optionsService.setOptions({ steps: [], themeColor: '#a167FE' });

            expect(optionsService.getBackdropColor()).toBe('161, 103, 254');
        })
    })
})