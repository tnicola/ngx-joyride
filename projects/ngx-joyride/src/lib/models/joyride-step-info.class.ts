import { StepActionType } from "../services/joyride-steps-container.service";

export class JoyrideStepInfo {
    number: number;
    name: string;
    route: string;
    actionType: StepActionType;
}