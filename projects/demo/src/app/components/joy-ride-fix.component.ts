import { Component, OnInit } from '@angular/core';
import { JoyrideService } from '../../../../ngx-joyride/src/public-api';

@Component({
  selector: 'joyride-fix',
  templateUrl: './joy-ride-fix.component.html',
  styleUrls: ['./joy-ride-fix.component.scss']
})
export class JoyRideFixComponent implements OnInit{
  title = 'JoyRideIssue';
  constructor(private joyride: JoyrideService) { }

  ngOnInit(): void {
  }
  
  startTour() {
    this.joyride.startTour({ 
      steps: ['firstStep', 'secondStep'],
      fixedHeader: '.header' // Added additional attribute to identify incase of fixed position elements
    });
  }
}
