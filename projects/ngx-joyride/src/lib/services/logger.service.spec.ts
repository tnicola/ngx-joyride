import { TestBed } from "@angular/core/testing";
import { LoggerService } from "./logger.service";
import { JoyrideOptionsService } from "./joyride-options.service";
import { JoyrideOptionsServiceFake } from "../test/fake/joyride-options-fake.service";

describe("LoggerService", () => {
    let loggerService: LoggerService;
    let optionsService: JoyrideOptionsServiceFake;
    let consoleInfoSpy: jasmine.Spy;
    let consoleDebugSpy: jasmine.Spy;
    let consoleWarnSpy: jasmine.Spy;
    let consoleErrorSpy: jasmine.Spy;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                LoggerService,
                { provide: JoyrideOptionsService, useClass: JoyrideOptionsServiceFake }
            ]
        });
    })

    beforeEach(() => {
        loggerService = TestBed.get(LoggerService);
        optionsService = TestBed.get(JoyrideOptionsService);

        consoleInfoSpy = spyOn(console, 'info');
        consoleDebugSpy = spyOn(console, 'debug');
        consoleWarnSpy = spyOn(console, 'warn');
        consoleErrorSpy = spyOn(console, 'error');
    })

    describe('debug', () => {
        it('should call console.debug if logs are enabled', () => {
            optionsService.areLogsEnabled.and.returnValue(true);
            loggerService.debug('Message', { param1: 123, param2: 'data' })

            expect(consoleDebugSpy).toHaveBeenCalledTimes(1);
            expect(consoleDebugSpy).toHaveBeenCalledWith('ngx-joyride:::Message', { param1: 123, param2: 'data' });
        });

        it('should NOT call console.debug if logs are not enabled', () => {
            optionsService.areLogsEnabled.and.returnValue(false);
            loggerService.debug();

            expect(consoleDebugSpy).not.toHaveBeenCalled();
        });
    });

    describe('info', () => {
        it('should call console.info if logs are enabled', () => {
            optionsService.areLogsEnabled.and.returnValue(true);
            loggerService.info('Message', { param1: 123, param2: 'data' })

            expect(consoleInfoSpy).toHaveBeenCalledTimes(1);
            expect(consoleInfoSpy).toHaveBeenCalledWith('ngx-joyride:::Message', { param1: 123, param2: 'data' });
        });

        it('should NOT call console.info if logs are not enabled', () => {
            optionsService.areLogsEnabled.and.returnValue(false);
            loggerService.info()

            expect(consoleInfoSpy).not.toHaveBeenCalled();
        });
    });

    describe('warn', () => {
        it('should call console.warn if logs are enabled', () => {
            optionsService.areLogsEnabled.and.returnValue(true);
            loggerService.warn('Message', { param1: 123, param2: 'data' })

            expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
            expect(consoleWarnSpy).toHaveBeenCalledWith('ngx-joyride:::Message', { param1: 123, param2: 'data' });
        });

        it('should NOT call console.warn if logs are not enabled', () => {
            optionsService.areLogsEnabled.and.returnValue(false);
            loggerService.warn()

            expect(consoleWarnSpy).not.toHaveBeenCalled();
        });
    });

    describe('error', () => {
        it('should call console.error if logs are enabled', () => {
            optionsService.areLogsEnabled.and.returnValue(true);
            loggerService.error('Message', { param1: 123, param2: 'data' })

            expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
            expect(consoleErrorSpy).toHaveBeenCalledWith('ngx-joyride:::Message', { param1: 123, param2: 'data' });
        });

        it('should NOT call console.error if logs are not enabled', () => {
            optionsService.areLogsEnabled.and.returnValue(false);
            loggerService.error()

            expect(consoleErrorSpy).not.toHaveBeenCalled();
        });
    });
});