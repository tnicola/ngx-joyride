import { TestBed } from '@angular/core/testing';
import { JoyrideStepsContainerService, StepActionType } from './joyride-steps-container.service';
import { JoyrideOptionsService } from './joyride-options.service';
import { JoyrideOptionsServiceFake } from '../test/fake/joyride-options-fake.service';
import { JoyrideStep } from '../models/joyride-step.class';
import { LoggerFake } from '../test/fake/logger-fake.service';
import { LoggerService } from './logger.service';

describe('JoyrideStepsContainerService', () => {
    let joyrideOptionsService: JoyrideOptionsServiceFake;
    let logger: LoggerFake;
    let joyrideStepsContainerService: JoyrideStepsContainerService;
    let STEP1: JoyrideStep;
    let STEP2: JoyrideStep;
    let STEP3: JoyrideStep;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                JoyrideStepsContainerService,
                { provide: JoyrideOptionsService, useClass: JoyrideOptionsServiceFake },
                { provide: LoggerService, useClass: LoggerFake }
            ]
        });
    });

    beforeEach(() => {
        joyrideOptionsService = TestBed.get(JoyrideOptionsService);
        logger = TestBed.get(LoggerService);
        joyrideStepsContainerService = TestBed.get(JoyrideStepsContainerService);
    });

    function setSteps(stepsName: string[]) {
        STEP1 = new JoyrideStep();
        STEP2 = new JoyrideStep();
        STEP3 = new JoyrideStep();
        STEP1.name = 'firstStep';
        STEP1.position = 'top';
        STEP1.route = 'abc';
        STEP2.name = 'second'; // Step without route
        STEP2.position = 'bottom';
        STEP2.route = '';
        STEP3.name = 'third';
        STEP3.position = 'center';
        STEP3.route = 'ghi';

        joyrideOptionsService.getStepsOrder.and.returnValue(stepsName);
        joyrideStepsContainerService.addStep(STEP1);
        joyrideStepsContainerService.addStep(STEP2);
        joyrideStepsContainerService.addStep(STEP3);
        joyrideStepsContainerService.init();
    }

    describe('init', () => {});

    describe('getStepsCount', () => {
        it('should return the number of steps passed by optionService', () => {
            joyrideOptionsService.getStepsOrder.and.returnValue(['one', 'two', 'three']);

            expect(joyrideStepsContainerService.getStepsCount()).toBe(3);
        });
    });

    describe('updatePosition', () => {
        it('should publish the change with stepHasBeenModified', () => {
            let step = new JoyrideStep();
            step.name = 'firstStep';
            joyrideStepsContainerService['steps'] = [{ id: 'firstStep', step }, { id: 'second', step: null }];
            let stepHasBeenModifiedSpy = spyOn(joyrideStepsContainerService, 'stepHasBeenModified');
            let nextSpy = spyOn(stepHasBeenModifiedSpy, 'next');

            joyrideStepsContainerService.updatePosition('firstStep', 'bottom');

            expect(nextSpy).toHaveBeenCalledWith(jasmine.objectContaining({ name: 'firstStep', position: 'bottom' }));
        });

        it('should update the step position', () => {
            let step = new JoyrideStep();
            step.name = 'second';
            step.position = 'top';
            joyrideStepsContainerService['steps'] = [{ id: 'firstStep@route1', step: null }, { id: 'second', step }];

            joyrideStepsContainerService.updatePosition('second', 'bottom');

            expect(joyrideStepsContainerService['steps'][1]).toEqual(
                jasmine.objectContaining({ id: 'second', step: jasmine.objectContaining({ ...step, position: 'bottom' }) })
            );
        });

        it('should log a warn message if we try to update a stop that is in the step list but does not exist on the DOM', () => {
            let step = new JoyrideStep();
            step.name = 'second';
            step.position = 'top';
            joyrideStepsContainerService['steps'] = [
                { id: 'firstStep@route1', step: null },
                { id: 'second', step },
                { id: 'third', step: null }
            ];

            joyrideStepsContainerService.updatePosition('third', 'bottom');

            expect(logger.warn).toHaveBeenCalledWith(
                'Trying to modify the position of third to bottom. Step not found!Is this step located in a different route?'
            );
        });

        it('should throw an error if we try to update a stop that does not exist in the step list', () => {
            let step = new JoyrideStep();
            step.name = 'second';
            step.position = 'top';
            joyrideStepsContainerService['steps'] = [
                { id: 'firstStep@route1', step: null },
                { id: 'second', step },
                { id: 'third', step: null }
            ];

            expect(() => joyrideStepsContainerService.updatePosition('thisStepDoesNotExist', 'bottom')).toThrowError(
                'The step with name: thisStepDoesNotExist does not exist in the step list.'
            );
        });
    });

    describe('addStep', () => {
        it('should not add one step to the temp list if a step with the same name already exist', () => {
            let THIS_STEP_ALREADY_EXIST = new JoyrideStep();
            THIS_STEP_ALREADY_EXIST.name = 'second';
            setSteps(['firstStep', 'second', 'third']);
            joyrideStepsContainerService.addStep(THIS_STEP_ALREADY_EXIST);

            expect(joyrideStepsContainerService['tempSteps'].length).toBe(3);
        });

        it("should add one step to the temp list if a step with the same name doesn't exist", () => {
            let STEP = new JoyrideStep();
            STEP.name = 'fourth';
            setSteps(['firstStep', 'second', 'third', 'fourth']);
            joyrideStepsContainerService.addStep(STEP);

            expect(joyrideStepsContainerService['tempSteps'].length).toBe(4);
            expect(joyrideStepsContainerService['tempSteps'][3]).toEqual(jasmine.objectContaining(STEP));
        });
    });

    describe('getStepNumber', () => {
        it('should return the stepPosition + 1', () => {
            setSteps(['firstStep', 'second', 'third', 'fourth']);

            expect(joyrideStepsContainerService.getStepNumber(STEP1.name)).toBe(1);
            expect(joyrideStepsContainerService.getStepNumber(STEP2.name)).toBe(2);
            expect(joyrideStepsContainerService.getStepNumber(STEP3.name)).toBe(3);
        });

        it('should return 1 for the stepPosition of the first step selected in the options', () => {
            joyrideOptionsService.getFirstStep.and.returnValue('third');
            setSteps(['firstStep', 'second', 'third', 'fourth']);

            expect(joyrideStepsContainerService.getStepNumber(STEP3.name)).toBe(1);
        });
    });

    describe('getStepRoute()', () => {
        beforeEach(() => {
            joyrideOptionsService.getStepsOrder.and.returnValue(['step1@url1', 'step2@url2', 'step3@url3']);
        });

        it('should return the route of the first step if called twice', () => {
            joyrideStepsContainerService.init();

            expect(joyrideStepsContainerService.getStepRoute(StepActionType.NEXT)).toBe('url1');
            expect(joyrideStepsContainerService.getStepRoute(StepActionType.NEXT)).toBe('url1');
        });

        it('should return the route of the step returned by getFirstStep', () => {
            joyrideOptionsService.getFirstStep.and.returnValue('step2@url2');
            joyrideStepsContainerService.init();

            expect(joyrideStepsContainerService.getStepRoute(StepActionType.NEXT)).toBe('url2');
        });

        it('should return an empty string if the first call is PREV', () => {
            joyrideStepsContainerService.init();

            expect(joyrideStepsContainerService.getStepRoute(StepActionType.PREV)).toBe('');
        });
    });
});
