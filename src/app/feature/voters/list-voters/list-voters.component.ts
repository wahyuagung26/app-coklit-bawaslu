import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-list-voters',
    templateUrl: './list-voters.component.html',
    styleUrls: ['./list-voters.component.scss']
})
export class ListVotersComponent implements OnInit {
    voterTypeId: string;
    voterTypeName: string;
    statusData: any;
    districtName: string;
    listTps: any;
    listTms: any;
    listCoklit: any;
    listDisabilitas: any;

    constructor(
        private activatedRoute: ActivatedRoute
    ) {
        this.statusData = environment.statusData;
    }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe(params => {
            this.voterTypeId = params.voterId;
            const voter = this.statusData.filter((val) => (val.id == params.voterId));
            this.voterTypeName = `${voter?.[0]?.text} ` ?? `Data `;
        });

        this.listTps = [];
        for (let index = 1; index <= 10; index++) {
            this.listTps.push({ id: index });
        }

        this.districtName = 'Kec. Lawang'
    }

}
