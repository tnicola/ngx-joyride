export class JoyrideError extends Error {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, JoyrideError.prototype);
    }
}

export class JoyrideStepDoesNotExist extends Error {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, JoyrideStepDoesNotExist.prototype);
    }
}

export class JoyrideStepOutOfRange extends Error {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, JoyrideStepOutOfRange.prototype);
    }
}
