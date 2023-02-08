import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-form-voters',
    templateUrl: './form-voters.component.html',
    styleUrls: ['./form-voters.component.scss']
})
export class FormVotersComponent implements OnInit {
    StatusDataId: string;
    StatusDataName: string;
    statusData: any;
    model: {
        status_coklit,
        ktp_elektronik,
        pemilih_baru,
        pemilih_pemula
    };

    constructor(
        private activatedRoute: ActivatedRoute
    ) {
        this.statusData = environment.statusData;
    }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe(params => {
            this.StatusDataId = params.voterId;
            const voter = this.statusData.filter((val) => (val.id == params.voterId));
            this.StatusDataName = `${voter?.[0]?.text} ` ?? `Data `;
        });

        this.resetValue();
    }

    resetValue() {
        this.model = {
            status_coklit: 'Belum',
            ktp_elektronik: 'Sudah',
            pemilih_baru: 'Ya',
            pemilih_pemula: 'Ya'
        }
    }

}
