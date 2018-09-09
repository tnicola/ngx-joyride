import { Component } from "@angular/core";
import { JoyrideService } from "ngx-joyride";
import { Router } from "@angular/router";
import { TranslateService } from '@ngx-translate/core';


@Component({
    selector: 'demo-app',
    template: `<nav>
                    <a routerLink="">Home</a>
                    <a routerLink="/about/you">About</a>
                    <a routerLink="/info">Info</a>
                </nav>
                <div>
                    <joyrideStep joyrideStep="ciao" [title]="'TITLE' | translate">ehila</joyrideStep>
                </div>
                <div >
                    <p>Paragraph 1</p>
                    <p>Paragraph 2</p>
                </div>
                <router-outlet></router-outlet>`
})
export class AppComponent {

    constructor(
        private readonly joyrideService: JoyrideService,
        private router: Router,

        private translate: TranslateService
    ) { }

    ngOnInit(): void {
        this.translate.setDefaultLang('en');
        this.translate.setTranslation('en', {
            "TITLE": "hello Nicola"
        })

    }
    startTour() {
        let options = {
            steps: ['myStep@app/routeA', 'step1@about/you', 'myStep2@app/routeB', 'home1@app', 'ciao', 'home2@app', 'stepHidden@app', 'step3@app', 'step2@about/you'],
            stepDefaultPosition: 'top',
            themeColor: '#345632',
            showPrevButton: true
        };
        this.joyrideService.startTour(options).subscribe((step) => {
            console.log("Next:", step);
        }, (e) => {
            console.log("Error", e);
        }, () => {
            console.log("Tour finished");
        });
    }


    stepDone() {
        this.router.navigate(['app']);
        setTimeout(() => {
            console.log("Step done!")
        }, 3000);
    }

}
