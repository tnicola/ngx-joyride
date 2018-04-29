import { browser, element, by, By, $, $$, ExpectedConditions } from 'protractor';

describe('When the tour starts', () => {
    it('a <joyride-step> should be present', () => {
        browser.get('http://localhost:8080');

        element(by.className('app__start-button')).click();

        let joyrideStep = element(by.tagName("joyride-step"));
        
        expect(joyrideStep.isPresent()).toBe(true);
    });
});