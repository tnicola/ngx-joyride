import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    selector: 'info-page',
    template: `<div joyrideStep="step1" nextStep="app#step4" (prev)="prevClicked()" (next)="goToHome()">Info</div>`
})
export class InfoComponent {
    constructor(private readonly router: Router) { }

    goToHome() { }

    prevClicked() { }
}