import { Component, DebugElement } from '@angular/core';
import { TestBed, async, ComponentFixture, } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { JoyrideButtonComponent } from './button.component';

@Component({
    selector: 'host',
    template: '<joyride-button [color]="color" (clicked)="onClick()"></joyride-button>'
})
class HostComponent {
    color: string;
    onClick: jasmine.Spy = jasmine.createSpy("onClick");
}

describe("ButtonComponent", () => {

    let fixture: ComponentFixture<JoyrideButtonComponent>;
    let hostFixture: ComponentFixture<HostComponent>;
    let component: JoyrideButtonComponent;
    let button: DebugElement;
    let hostComponent: HostComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [HostComponent, JoyrideButtonComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        hostFixture = TestBed.createComponent(HostComponent);
        hostComponent = hostFixture.componentInstance;
        component = hostFixture.debugElement.query(By.directive(JoyrideButtonComponent)).componentInstance;
    });

    it("should have the color equals to the one passed by the host", () => {
        hostComponent.color = "#123456";

        hostFixture.detectChanges();

        expect(component.color).toBe('#123456');
    });

    it("should call onClick() when 'clicked' event is fired", () => {
        component.clicked.emit()

        expect(hostComponent.onClick).toHaveBeenCalledTimes(1);
    });

    it("should set hover to true when the mouse is overing the button", () => {
        component.hover = false;

        button = hostFixture.debugElement.query(By.css(".joyride-button"));
        button.triggerEventHandler("mouseover", null);

        expect(component.hover).toBe(true);
    });

    it("should set hover to false when the mouse is leaving the button", () => {
        component.hover = true;

        button = hostFixture.debugElement.query(By.css(".joyride-button"));
        button.triggerEventHandler("mouseleave", null);

        expect(component.hover).toBe(false);
    });
});