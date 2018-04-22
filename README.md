

# Angular 2 Joyride
An Angular Joyride library built entirely in Angular, without using any heavy external dependencies like Bootstrap or JQuery.

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
  
