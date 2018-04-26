import { Component } from '@angular/core';
import { TestBed, async, ComponentFixture, } from '@angular/core/testing';
import { JoyrideArrowComponent } from './arrow.component';
import { By } from '@angular/platform-browser';

@Component({
    selector: 'host',
    template: '<joyride-arrow [position]="pos"></joyride-arrow>'
})
class HostComponent {
    pos: string;
}

describe("ArrowComponent", () => {

    let fixture: ComponentFixture<JoyrideArrowComponent>;
    let hostFixture: ComponentFixture<HostComponent>;
    let component: JoyrideArrowComponent;
    let hostComponent: HostComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [HostComponent, JoyrideArrowComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        hostFixture = TestBed.createComponent(HostComponent);
        hostComponent = hostFixture.componentInstance;
        component = hostFixture.debugElement.query(By.directive(JoyrideArrowComponent)).componentInstance;
    });

    it("should be set to 'top' by default", () => {
        expect(component.position).toBe('top');
    });

    it("should be set to the value passed by host component", () => {
        hostComponent.pos = 'right';

        hostFixture.detectChanges();

        expect(component.position).toBe('right');
    });
});