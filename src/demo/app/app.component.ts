import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { JoyrideService } from 'angular2-joyride';

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {

  constructor(private readonly joyrideService: JoyrideService) {

  }

  startTour() {
    this.joyrideService.setOptions({});
    this.joyrideService.startTour();
  }

}