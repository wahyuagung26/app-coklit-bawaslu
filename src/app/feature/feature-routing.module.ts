import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ListStatusDataComponent } from './status-data/components/list-status-data/list-status-data.component';
import { ListUserComponent } from './user/components/list-user/list-user.component';
import { FormVotersComponent } from './voters/components/form-voters/form-voters.component';
import { ListVotersComponent } from './voters/components/list-voters/list-voters.component';
import { RecapComponent } from './voters/recap/recap.component';

const routes: Routes = [
    { path: '', component: RecapComponent },
    { path: 'home', component: RecapComponent },
    { path: 'users', component: ListUserComponent },
    { path: 'voters/:voterId', component: ListVotersComponent },
    { path: 'add-voter/:voterId', component: FormVotersComponent },
    { path: 'recapitulation', component: RecapComponent},
    { path: 'status-data', component: ListStatusDataComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FeatureRoutingModule { }
