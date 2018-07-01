import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    selector: 'about-page',
    template: `<div joyrideStep="step1" nextStep="step2" (next)="onNext()" (prev)="onPrev()">About title</div>
               <div joyrideStep="step2" nextStep="info#step1" (next)="onNext()" (prev)="onPrev()">About Subtitle</div>`
})
export class AboutComponent {

    constructor(private readonly router: Router) { }

    onNext() { }

    onPrev() { }
}
