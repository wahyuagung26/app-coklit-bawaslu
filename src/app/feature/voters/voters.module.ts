import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ListVotersComponent } from './list-voters/list-voters.component';
import { FormVotersComponent } from './form-voters/form-voters.component';
import { RecapTmsComponent } from './parts/recap-tms/recap-tms.component';
import { CounterComponent } from './parts/counter/counter.component';
import { FormFilterComponent } from './parts/form-filter/form-filter.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TableRacapComponent } from './parts/table-racap/table-racap.component';
import { RecapComponent } from './recap/recap.component';

@NgModule({
    declarations: [ListVotersComponent, FormVotersComponent, RecapTmsComponent, CounterComponent, FormFilterComponent, TableRacapComponent, RecapComponent],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        NgbModule
    ]
})
export class VotersModule { }
