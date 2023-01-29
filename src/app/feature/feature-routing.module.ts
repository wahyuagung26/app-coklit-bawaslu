import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ListUserComponent } from './user/components/list-user/list-user.component';
import { FormVotersComponent } from './voters/form-voters/form-voters.component';
import { ListVotersComponent } from './voters/list-voters/list-voters.component';

const routes: Routes = [
    { path: '', component: DashboardComponent },
    { path: 'home', component: DashboardComponent },
    { path: 'user', component: ListUserComponent },
    { path: 'voters/:voterId', component: ListVotersComponent },
    { path: 'add-voter/:voterId', component: FormVotersComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FeatureRoutingModule { }
