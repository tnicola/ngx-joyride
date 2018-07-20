import { Component, OnInit, AfterViewInit, ElementRef, Injector, Output, ChangeDetectionStrategy } from '@angular/core';
import { JoyrideService } from 'ngx-joyride';
import { Router } from '@angular/router';

@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.sass'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements AfterViewInit, OnInit {
    stepVisible: boolean = false;

    title: string = "ngx-joyride library demo";
    constructor(
        private readonly joyrideService: JoyrideService,
        private router: Router
    ) { }

    ngAfterViewInit(): void {
        //this.startTour();
    }

    ngOnInit(): void {
        //this.startTour();
    }

    toggleAction() {
        this.stepVisible = true;
    }

    stepDone() {
        setTimeout(() => {
            this.title = "Tour Finished!";
            console.log("Step done!")
        }, 3000);
    }

    onPrev() {
        console.log("Prev Clicked");
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
            this.stepDone();
            console.log("Tour finished");
        });
    }
}