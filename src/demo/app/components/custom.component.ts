import { Component } from "@angular/core";

const img = require("../../assets/images/angular.png");
@Component({
    selector: 'aj-custom-component',
    template: ` <div>
                    <h1>Title</h1>
                    <div>Simple description</div>
                    <img [src]="img">
                    <h3>Subtitle 1</h3>
                    <h3>Subtitle 2</h3>
                </div>`
})
export class CustomComponent {
    img = img;
}