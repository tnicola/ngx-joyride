import { TestBed } from "@angular/core/testing";
import { JoyrideStepsContainerService } from "./joyride-steps-container.service";
import { JoyrideOptionsService } from "./joyride-options.service";
import { JoyrideOptionsServiceFake } from "../test/fake/joyride-options-fake.service";
import { JoyrideStep } from "../models/joyride-step.class";

describe("JoyrideStepsContainerService", () => {

    let joyrideOptionsService: JoyrideOptionsServiceFake;
    let joyrideStepsContainerService: JoyrideStepsContainerService;
    let STEP1: JoyrideStep;
    let STEP2: JoyrideStep;
    let STEP3: JoyrideStep;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                JoyrideStepsContainerService,
                { provide: JoyrideOptionsService, useClass: JoyrideOptionsServiceFake }
            ]
        });
    });

    beforeEach(() => {
        joyrideOptionsService = TestBed.get(JoyrideOptionsService);
        joyrideStepsContainerService = TestBed.get(JoyrideStepsContainerService);
    });

    function setSteps(stepsName: string[]) {
        STEP1 = new JoyrideStep();
        STEP2 = new JoyrideStep();
        STEP3 = new JoyrideStep();
        STEP1.name = 'firstStep';
        STEP1.position = 'top';
        STEP1.route = 'abc';
        STEP2.name = 'second';
        STEP2.position = 'bottom';
        STEP2.route = 'def';
        STEP3.name = 'third';
        STEP3.position = 'center';
        STEP3.route = 'ghi';

        joyrideOptionsService.getStepsOrder.and.returnValue(stepsName);
        joyrideStepsContainerService.addStep(STEP1);
        joyrideStepsContainerService.addStep(STEP2);
        joyrideStepsContainerService.addStep(STEP3);
        joyrideStepsContainerService.initSteps();
    }

    describe("getNumberOfSteps", () => {
        it("should return the number of steps passed by optionService", () => {
            joyrideOptionsService.getStepsOrder.and.returnValue(["one", "two", "three"]);

            expect(joyrideStepsContainerService.getNumberOfSteps()).toBe(3);
        });
    });

    describe("setPosition", () => {
        it("should publish the change with stepHasBeenModified", () => {
            setSteps(["firstStep", "second", "third"]);
            let STEP1_MODIFIED = { ...STEP1 };
            STEP1_MODIFIED.position = 'bottom';
            let stepHasBeenModifiedSpy = spyOn(joyrideStepsContainerService, 'stepHasBeenModified');
            let nextSpy = spyOn(stepHasBeenModifiedSpy, 'next');

            joyrideStepsContainerService.setPosition(STEP1, 'bottom');

            expect(nextSpy).toHaveBeenCalledWith(STEP1_MODIFIED);
        });
    });

    describe("addStep", () => {
        it("should not add one step to the list if a step with the same name already exist", () => {
            let THIS_STEP_ALREADY_EXIST = new JoyrideStep();
            THIS_STEP_ALREADY_EXIST.name = 'second';
            setSteps(["firstStep", "second", "third"]);
            joyrideStepsContainerService.addStep(THIS_STEP_ALREADY_EXIST);
            joyrideStepsContainerService.initSteps();

            expect(joyrideStepsContainerService.get(3)).toBe(undefined);
        });
        it("should add one step to the list if a step with the same name doesn't exist", () => {
            let STEP = new JoyrideStep();
            STEP.name = 'fourth';
            setSteps(["firstStep", "second", "third", "fourth"]);
            joyrideStepsContainerService.addStep(STEP);
            joyrideStepsContainerService.initSteps();

            expect(joyrideStepsContainerService.get(3)).toEqual(jasmine.objectContaining(STEP));
        });
    });

    describe('getStepPosition', () => { 
        it('should return the stepPosition + 1', () => {
            setSteps(["firstStep", "second", "third", "fourth"]);
            expect(joyrideStepsContainerService.getStepPosition(STEP3)).toBe(3)
        });
    });
})