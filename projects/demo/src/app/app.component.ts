import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { JoyrideService } from '../../../ngx-joyride/src/public-api';

@Component({
    selector: 'demo-app',
    template: `
    <joyride-fix></joyride-fix>
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
