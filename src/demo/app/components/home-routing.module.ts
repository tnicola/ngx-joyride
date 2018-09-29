import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./home.component";
import { NgModule, Component } from "@angular/core";

@Component({
    selector: 'sel-a',
    template: `<div joyrideStep="myStep" 
                    title="Title 1"
                    text="Prova"
                    [prevTemplate]="prev" 
                    [nextTemplate]="next" 
                    [doneTemplate]="done"
                    [counterTemplate]="counter">
                Route A
                </div>
                <ng-template #prev>
                    <button>Previous</button>
                </ng-template>
                <ng-template #next>
                    <button>Next</button>
                </ng-template>
                <ng-template #done>
                    <button>Done</button>
                </ng-template>
                <ng-template #counter let-step="step" let-total="total">
                     {{ step }} of {{ total }} steps
                </ng-template>
            <div>Route A subtitle</div>`
})
export class PageAComponent {
    text = 'Mike';
 }

@Component({
    selector: 'sel-b',
    template:`<div joyrideStep="myStep2" [stepContent]="somecontent" [stepContentParams]="somecontentparams">Route B</div>
    <ng-template #somecontent let-name="name">Hello {{name}} from dynamic content at Route B</ng-template>`
})
export class PageBComponent {
    somecontentparams:object = {
        name: 'John'
    };
 }

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