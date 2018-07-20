import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InfoComponent } from './components/info.component';
import { AboutComponent } from './components/about.component';

const routes: Routes = [
    { path: '', redirectTo: '/app', pathMatch: 'full' },
    { path: 'app', loadChildren: './components/home.module#HomeModule'},
    { path: 'info', component: InfoComponent },
    { path: 'about/you', component: AboutComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }