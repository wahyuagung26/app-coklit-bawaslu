import { Component, OnInit } from '@angular/core';
import { RegionService } from 'src/app/core/services/region.service';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../auth/services/auth.service';
import { VotersService } from '../services/voters.service';

@Component({
    selector: 'app-recap',
    templateUrl: './recap.component.html',
    styleUrls: ['./recap.component.scss']
})
export class RecapComponent implements OnInit {
    villageId: number;
    villageName: string;
    districtId: number;
    districtName: string;
    statusData: any;
    statusDataName: string;
    userLogin: any;
    districts: any;
    villages: any;
    filter: {
        status_data_id,
        district_id,
        village_id,
    }

    summaries: any;

    constructor(
        private authService: AuthService,
        private voterService: VotersService,
        private regionService: RegionService,
    ) {
        this.userLogin = this.authService.getUser();
        this.districtName = (this.userLogin?.district_name ?? '').toLowerCase();
        this.villageId = this.userLogin.village_id;
        this.villageName = (this.userLogin?.village_name ?? '').toLowerCase();
        this.districtId = this.userLogin?.district_id;

        this.getDistricts();
    }

    ngOnInit(): void {
        this.statusData = environment.statusData;
        this.summaries = [];

        this.resetFilter();
        this.getRecap();
        this.getStatusData();
    }

    getStatusData() {
        const voter = this.statusData.filter((val) => (val.id == this.filter.status_data_id));
        this.statusDataName = `${voter?.[0]?.text} ` ?? `Data `;
    }

    resetFilter() {
        this.filter = {
            status_data_id: 1,
            district_id: this.districtId,
            village_id: this.villageId,
        }
    }

    export() {
        window.open(`${environment.apiURL}/v1/summaries/${this.filter.status_data_id}/export/excel?village_id=${this.filter.village_id}&district_id=${this.filter.district_id}`);
    }

    getRecap() {
        this.voterService.getRecap(this.filter.status_data_id).subscribe((resp: any) => {
            this.summaries = resp.data;
        }, err => {
            console.log(err);
        });
    }

    getDistricts() {
        this.regionService.getDistricts().subscribe((res: any) => {
            this.districts = res.data;

            if (this.userLogin?.district_id) {
                this.getVillages(this.userLogin.district_id);
            }
        }, err => {
            console.log(err);
        });
    }

    getVillages(districtsId) {
        this.regionService.getVillages(districtsId).subscribe((res: any) => {
            this.villages = res.data;
        }, err => {
            console.log(err);
        });
    }

}
