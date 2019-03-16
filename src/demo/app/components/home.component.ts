import { Component, OnInit, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { JoyrideService } from 'ngx-joyride';

@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.sass'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements AfterViewInit, OnInit {
    stepVisible: boolean = false;

    topics = <any>[];

    title: string = 'ngx-joyride library demo';
    constructor(private readonly joyrideService: JoyrideService) {}

    ngAfterViewInit(): void {}

    ngOnInit(): void {
        for (let i = 0; i < 100; i++) {
            this.topics.push({
                name: 'element' + i,
                description: 'Element in a scrollable list.'
            });
        }
    }

    toggleAction() {
        this.stepVisible = true;
    }

    stepDone() {
        setTimeout(() => {
            this.title = 'Tour Finished!';
            console.log('Step done!');
        }, 3000);
    }

    onPrev() {
        console.log('Prev Clicked');
    }

    startTour() {
        let options = {
            steps: [
                'firstStep@app',
                'step11@app',
                'scrollStep@app',
                'step1@about/you',
                'myStep2@app/routeB',
                'home1@app',
                'ciao',
                'home2@app',
                'stepHidden@app',
                'step3@app',
                'step2@about/you'
            ],
            // startWith: 'step3@app',
            // waitingTime: 3000,
            stepDefaultPosition: 'top',
            themeColor: '#345632',
            showPrevButton: true,
            logsEnabled: true
        };
        this.joyrideService.startTour(options).subscribe(
            step => {
                console.log('Next:', step);
            },
            e => {
                console.log('Error', e);
            },
            () => {
                this.stepDone();
                console.log('Tour finished');
            }
        );
    }
}
