import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InfoComponent } from './components/info.component';
import { AboutComponent } from './components/about.component';

const routes: Routes = [
    { path: 'app', loadChildren: './home.module#HomeModule' },
    { path: '', redirectTo: '/app', pathMatch: 'full' },
    { path: 'info', component: InfoComponent },
    { path: 'about/you', component: AboutComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }