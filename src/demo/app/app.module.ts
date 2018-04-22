import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { JoyrideModule } from 'angular2-joyride';

@NgModule({
  imports: [
    JoyrideModule,
    BrowserModule
  ],
  declarations: [
    AppComponent

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }