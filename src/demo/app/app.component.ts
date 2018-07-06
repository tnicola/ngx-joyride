import { Component } from "@angular/core";

@Component({
    selector: 'demo-app',
    template: `<nav>
                    <a routerLink="">Home</a>
                    <a routerLink="/about">About</a>
                    <a routerLink="/info">Info</a>
                </nav>
                <div>
                    <joyrideStep joyrideStep="ciao">ehila</joyrideStep>
                </div>
                <div >
                    <p>Paragraph 1</p>
                    <p>Paragraph 2</p>
                </div>
                <router-outlet></router-outlet>`
})
export class AppComponent {

}
