



# Angular 2 Joyride
An Angular Joyride library built entirely in Angular, without using any heavy external dependencies like Bootstrap or JQuery.

<p align="center">
	<img src ="https://github.com/tnicola/angular2-joyride/blob/master/docs/joyrideStepExample.PNG" />
</p>

## Demo
See the [demo](https://tnicola.github.io/angular2-joyride/). Let's take a tour! :earth_americas: 

## Install

    npm install angular2-joyride

## Usage

 #### 1. Mark your HTML elements with the `joyrideStep` directive

```typescript
  <h1 joyrideStep title="Page Title" text="Main title!" stepNumber="2">Text</h1>
```



  #### 2. Import the `JoyrideModule` in your AppModule
  ```typescript
@NgModule({
	declarations: [AppComponent],
	imports: [
		JoyrideModule,
		BrowserModule
	],
	providers: [],
	bootstrap: [AppComponent]
 })
 export class AppModule { }
 ```
  #### 3. Inject the `JoyrideService` in your Component and start the Tour
```typescript
@Component({
  selector: 'app-component',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent {
  constructor(private readonly joyrideService: JoyrideService) { }

  onClick() {
    this.joyrideService.startTour();
  }
}
```
  #### 4. En-joy :wink:
  
## Directive Inputs
You can use the `joyrideStep` directive with these inputs:

@Input | Required | Purpose  | Values 
---- | ---- | ---- | ---- 
stepNumber | Yes | The order in which the step should appear during the tour. | 1, ..., n 
stepPosition | No | The position in which the step will be drawn. | 'top', 'bottom'
title | No | The step title. | string 
text |  No | The step text content. | string 

## Next features

 - Adding 'right', 'left', 'fullPage' stepPosition values.
 - More options for the tour (like changing the theme color, the step template and the step behaviour, ... )
 - Allow you to use your custom Angular component inside the step.
 - Feel free to ask or share your ideas!

## Licence
MIT

