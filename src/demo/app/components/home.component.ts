import { Component, OnInit, AfterViewInit, ElementRef, Injector, Output } from '@angular/core';
import { JoyrideService } from 'ngx-joyride';
import { Router } from '@angular/router';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent {
  constructor(
    private readonly joyrideService: JoyrideService,
    private router: Router
  ) { }

  onNextCallback() {
  }

  onPrev(){
    console.log("Prev Clicked")
  }

  startTour() {
    let options = {
      firstStep: 'step1',
      stepDefaultPosition: 'top',
      themeColor: '#345632',
      showCounter: false,
      showPrevButton: true
    };
    this.joyrideService.startTour(options);
  }
}