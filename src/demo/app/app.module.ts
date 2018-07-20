import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { JoyrideModule } from 'ngx-joyride';
import { InfoComponent } from './components/info.component';
import { AboutComponent } from './components/about.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    JoyrideModule.forRoot(),
    BrowserModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    AboutComponent,
    InfoComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }