import { Component, OnInit, AfterViewInit, ElementRef, Injector, Output } from '@angular/core';
import { JoyrideService } from 'ngx-joyride';
import { Router } from '@angular/router';

@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.sass']
})
export class HomeComponent {

    stepVisible: boolean = false;

    title: string = "ngx-joyride library demo";
    constructor(
        private readonly joyrideService: JoyrideService,
        private router: Router
    ) { }

    toggleAction() {
        this.stepVisible = true;
    }

    stepDone() {
        this.title = "Tour Finished!";
    }

    onPrev() {
        console.log("Prev Clicked")
    }

    startTour() {
        let options = {
            steps: ['step1@app', 'ciao', 'step2@app', 'stepHidden@app', 'step1@about'],
            stepDefaultPosition: 'top',
            themeColor: '#345632',
            //showCounter: false,
            showPrevButton: true
        };
        this.joyrideService.startTour(options);
    }
}