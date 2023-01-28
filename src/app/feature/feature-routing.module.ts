import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ListUserComponent } from './user/components/list-user/list-user.component';

const routes: Routes = [
    { path: '', component: DashboardComponent },
    { path: 'home', component: DashboardComponent },
    { path: 'user', component: ListUserComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FeatureRoutingModule { }
