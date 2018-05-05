import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { JoyrideModule } from 'angular2-joyride';
import { CustomComponent } from './components/custom.component';

@NgModule({
  imports: [
    JoyrideModule,
    BrowserModule
  ],
  declarations: [
    AppComponent,
    CustomComponent

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }