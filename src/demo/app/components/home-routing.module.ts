import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./home.component";
import { NgModule, Component } from "@angular/core";

@Component({
    selector: 'sel-a',
    template: '<div joyrideStep="myStep">Route A</div><div>Route A subtitle</div>'
})
export class PageAComponent { }

@Component({
    selector: 'sel-b',
    template: '<div joyrideStep="myStep2">Route B</div>'
})
export class PageBComponent { }


const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    { path: 'routeA', component: PageAComponent },
    { path: 'routeB', component: PageBComponent }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HomeRoutingModule { }