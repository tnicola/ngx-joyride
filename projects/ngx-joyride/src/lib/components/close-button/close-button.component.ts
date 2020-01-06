import { Component } from '@angular/core';

@Component({
    selector: 'joy-close-button',
    template: `<svg viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
                <line x1="1" y1="24" 
                    x2="24" y2="1" 
                    stroke="black" 
                    stroke-width="3"/>
                <line x1="1" y1="1" 
                    x2="24" y2="24" 
                    stroke="black" 
                    stroke-width="3"/>
            </svg>`
})

export class JoyrideCloseButtonComponent { }