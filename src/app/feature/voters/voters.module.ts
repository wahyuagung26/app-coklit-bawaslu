import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { ListVotersComponent } from './components/list-voters/list-voters.component';
import { FormVotersComponent } from './components/form-voters/form-voters.component';
import { RecapTmsComponent } from './components/parts/recap-tms/recap-tms.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TableRacapComponent } from './components/parts/table-racap/table-racap.component';
import { RecapComponent } from './recap/recap.component';

@NgModule({
    declarations: [ListVotersComponent, FormVotersComponent, RecapTmsComponent, TableRacapComponent, RecapComponent],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        NgbModule,
        DataTablesModule,
        NgxDatatableModule
    ]
})
export class VotersModule { }
