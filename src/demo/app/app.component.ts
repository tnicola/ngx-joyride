import { Component } from "@angular/core";

@Component({
    selector: 'demo-app',
    template: `<nav>
                    <a routerLink="">Home</a>
                    <a routerLink="/about">About</a>
                    <a routerLink="/info">Info</a>
                </nav>
                <joyrideStep joyrideStep="ciao">ehila</joyrideStep>
                <router-outlet></router-outlet>`
})
export class AppComponent {

}
