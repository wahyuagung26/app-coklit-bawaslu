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
    }

    async ngOnInit() {
        this.statusData = environment.statusData;
        this.summaries = [];

        this.resetFilter();
        this.getDistricts();
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

    setVillageName() {
        if (this.villages) {
            this.villageName = this.villages.find(item => this.filter.village_id == item.id)?.village_name;
        }
    }

    setDistrictName() {
        if (this.districts) {
            this.districtName = this.districts.find(item => this.filter.district_id == item.id)?.district_name;
        }
    }

    getRecap() {

        this.setVillageName();
        this.setDistrictName();

        this.villageId = this.filter.village_id;
        this.districtId = this.filter.district_id;

        this.voterService.getRecap(this.filter.status_data_id, this.filter).subscribe((resp: any) => {
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

            if (this.userLogin.role == 'admin desa') {
                this.filter.village_id = this.userLogin.village_id;
            } else {
                this.filter.village_id = res.data?.[0]?.id;
                // set default params from first array
                this.villageName = res.data?.[0]?.village_name;
                this.villageId = res.data?.[0]?.id;
                this.districtId = res.data?.[0]?.district_id;
            }
        }, err => {
            console.log(err);
        });
    }

}
