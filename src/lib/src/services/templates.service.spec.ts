import { TestBed } from "@angular/core/testing";
import { TemplatesService } from "./templates.service";
import { Component, TemplateRef, ViewChild } from "@angular/core";

@Component({
    template: `
        <div #customComponent>
            <div>My component</div>
        </div>`
})
class CustomComponent {
    @ViewChild('customComponent') template: TemplateRef<any>;
}

describe("TemplatesService", () => {
    let component: CustomComponent;
    let TEMPLATE: TemplateRef<any>;
    let templatesService: TemplatesService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [CustomComponent],
            providers: [
                TemplatesService
            ]
        });
    });
    beforeEach(() => {
        templatesService = TestBed.get(TemplatesService);
        let fixture = TestBed.createComponent(CustomComponent);
        component = fixture.componentInstance;
        TEMPLATE = component.template;
    })

    describe("setPrevButton & getPrevButton", () => {
        it("should set the prev button template", () => {
            templatesService.setPrevButton(TEMPLATE);

            expect(templatesService.getPrevButton()).toEqual(TEMPLATE);
        });
    });

    describe("setNextButton & getNextButton", () => {
        it("should set the next button template", () => {
            templatesService.setNextButton(TEMPLATE);

            expect(templatesService.getNextButton()).toEqual(TEMPLATE);
        });
    });

    describe("setDoneButton & getDoneButton", () => {
        it("should set the done button template", () => {
            templatesService.setDoneButton(TEMPLATE);

            expect(templatesService.getDoneButton()).toEqual(TEMPLATE);
        });
    });

    describe("setCounter & getCounter", () => {
        it("should set the counter template", () => {
            templatesService.setCounter(TEMPLATE);

            expect(templatesService.getCounter()).toEqual(TEMPLATE);
        });
    });
});