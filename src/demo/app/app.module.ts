import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { JoyrideModule } from 'ngx-joyride';
import { CustomComponent } from './components/custom.component';
import { InfoComponent } from './components/info.component';
import { AboutComponent } from './components/about.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home.component';

@NgModule({
  imports: [
    JoyrideModule,
    BrowserModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    CustomComponent,
    AboutComponent,
    InfoComponent,
    HomeComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }