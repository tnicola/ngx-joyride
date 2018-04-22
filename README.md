
# Angular 2 Joyride
A pure Angular library to build 

## Install

    npm install angular2-joyride

## Usage

 #### 1. Mark your HTML elements with the `joyrideStep` directive

```typescript
  <h1 joyrideStep title="Page Title" text="Main title!"stepNumber="2">Text</h1>
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
  
