import { Component } from '@angular/core';
import { JoyrideService } from 'ngx-joyride';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'demo-app',
    template: `
        <nav class="toolbar"><a routerLink="">Home</a> <a routerLink="/about/you">About</a> <a routerLink="/info">Info</a></nav>
        <div joyrideStep="firstStep" title="demoTour" text="Hi, Welcome to demo tour">phone</div>
        <div><joyrideStep joyrideStep="ciao" [title]="'TITLE' | translate">ehila</joyrideStep></div>
        <div>
            <p>Paragraph 1</p>
            <p>Paragraph 2</p>
        </div>
        <router-outlet></router-outlet>
    `,
    styleUrls: ['./app.component.sass']
})
export class AppComponent {
    constructor(private readonly joyrideService: JoyrideService, private router: Router, private translate: TranslateService) {}

    ngOnInit(): void {
        this.translate.setDefaultLang('en');
        this.translate.setTranslation('en', {
            TITLE: 'hello Nicola'
        });
    }
}
