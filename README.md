[![npm version](https://badge.fury.io/js/ngx-joyride.svg)](https://badge.fury.io/js/ngx-joyride)
[![Build Status](https://travis-ci.org/tnicola/ngx-joyride.svg?branch=master)](https://travis-ci.org/tnicola/ngx-joyride)
# Angular Joyride
An Angular Tour (Joyride) library built entirely in Angular, without using any heavy external dependencies like Bootstrap or JQuery.
From now on you can easily guide your users through your site showing them all the sections and features.

<p align="center">
	<img src ="https://github.com/tnicola/ngx-joyride/blob/master/docs/joyrideStepExample.PNG" />
</p>

## Demo
See the [demo](https://tnicola.github.io/ngx-joyride/). Let's take a tour! :earth_americas: 

## Install

    npm install ngx-joyride
or

    yarn add ngx-joyride

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
  templateUrl: './app.component.html'
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

@Input | Required | Purpose  | Values/Type 
---- | ---- | ---- | ---- 
stepNumber | Yes | The order in which the step should appear during the tour. | 1, ..., n 
stepPosition | No | The position in which the step will be drawn. | 'top', 'right', 'bottom', 'left', 'center'
title | No | The step title. | string 
text |  No | The step text content. | string 
stepContent | No | An Angular template with custom content | TemplateRef<any>
	
### Use Custom Content
If you'd like to use custom HTML content instead of simple text you can use the `stepContent` property instead of `text`. Let's see how.
```html
<div joyrideStep [stepNumber]="1" [stepContent]="customContent">I'm the target element.</div>
<ng-template #customContent>
	... Insert whatever you'd like to ...
</ng-template>
 ```
	
## Options

Name | Required | Purpose | Type | Default value
---- | ---- | ---- | ---- | ----
stepDefaultPosition | No | Define a step default position. The stepPositon set in the directive override this value. | string | bottom
themeColor | No | Backdrop, buttons and title color. (Hexadecimal value) | string | #3b5560
showCounter | No | Show the counter on the bottom-left. | boolean | true
showPrevButton | No | Show the "Prev" button. | boolean | true
logsEnabled | No | Enable logs to see info about the library status. Usuful to get a meaningful error message. | boolean | false

You can change each element step css overriding the default style.

### How to set the options
```typescript
this.joyrideService.startTour({
    showPrevButton: false,
    stepDefaultPosition: 'top',
    themeColor: '#212f23'
});
 ```

## Licence
MIT