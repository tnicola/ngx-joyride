import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { HomeRoutingModule, PageAComponent, PageBComponent } from './home-routing.module';
import { JoyrideModule } from 'ngx-joyride';
import { CustomComponent } from './custom.component';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    JoyrideModule.forChild(),
    HomeRoutingModule
  ],
  declarations: [
    HomeComponent,
    CustomComponent,
    PageAComponent,
    PageBComponent
  ]
})
export class HomeModule { }