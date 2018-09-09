import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { JoyrideModule } from 'ngx-joyride';
import { InfoComponent } from './components/info.component';
import { AboutComponent } from './components/about.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    AppRoutingModule,
    JoyrideModule.forRoot(),
    BrowserModule,
    TranslateModule.forRoot()
  ],
  declarations: [
    AppComponent,
    AboutComponent,
    InfoComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }