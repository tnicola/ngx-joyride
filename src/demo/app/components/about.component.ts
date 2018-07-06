import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    selector: 'about-page',
    template: `<div joyrideStep="step1" (next)="onNext()" (prev)="onPrev()"><h1>About title</h1></div>
               <div joyrideStep="step2" (next)="onNext()" (prev)="onPrev()">About Subtitle</div>`
})
export class AboutComponent {

    constructor(private readonly router: Router) { }

    onNext() { }

    onPrev() { }
}
