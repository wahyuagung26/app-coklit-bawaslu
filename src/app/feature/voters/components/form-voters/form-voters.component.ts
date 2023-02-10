import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreService } from 'src/app/core/services/core.service';
import { RegionService } from 'src/app/core/services/region.service';
import { AuthService } from 'src/app/feature/auth/services/auth.service';
import { environment } from 'src/environments/environment';
import { VotersService } from '../../services/voters.service';

@Component({
    selector: 'app-form-voters',
    templateUrl: './form-voters.component.html',
    styleUrls: ['./form-voters.component.scss']
})
export class FormVotersComponent implements OnInit {
    statusDataId: string;
    statusDataName: string;
    statusData: any;
    listTps: any;
    listTms: any;
    listDisabilitas: any;
    districts: any;
    villages: any;
    userLogin: any;
    formModel: {
        nik,
        nkk,
        name,
        place_of_birth,
        date_of_birth,
        married_status,
        gender,
        address,
        rt,
        rw,
        disabilities,
        tps,
        tms,
        district_id,
        village_id,
        is_coklit,
        is_ktp_el,
        is_new_voter,
        is_novice_voter,
        is_profile_updated,
        is_checked
    };

    constructor(
        private activatedRoute: ActivatedRoute,
        private votersService: VotersService,
        private regionService: RegionService,
        private coreService: CoreService,
        private authService: AuthService
    ) {
        this.statusData = environment.statusData;
    }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe(params => {
            this.statusDataId = params.voterId;
            const voter = this.statusData.filter((val) => (val.id == params.voterId));
            this.statusDataName = `${voter?.[0]?.text} ` ?? `Data `;
        });

        this.authService.getProfile().subscribe((user: any) => {
            this.userLogin = user;
            if (this.userLogin.district_id) {
                this.getVillages(this.userLogin.district_id);
            }
        });

        this.resetValue();
        this.getDistricts();

        this.setListTps();
        this.setListTMS();
        this.setListDisabilitas();
    }

    resetValue() {
        this.formModel = {
            nik: '',
            nkk: '',
            name: '',
            place_of_birth: '',
            date_of_birth: '',
            married_status: '1',
            gender: '1',
            address: '',
            rt: '',
            rw: '',
            disabilities: '0',
            tps: '1',
            tms: '0',
            district_id: this.userLogin?.district_id ?? '',
            village_id: this.userLogin?.village_id ?? '',
            is_coklit: '1',
            is_ktp_el: '1',
            is_new_voter: '1',
            is_novice_voter: '1',
            is_profile_updated: '1',
            is_checked: '0'
        };
    }

    save() {
        this.votersService.save(this.statusDataId, this.formModel).subscribe((res: any) => {
            this.coreService.alertSuccess('Berhasil', res.data.message);
            this.resetValue();
        }, res => {
            this.coreService.alertError('Gagal', res.error.errors);
        })
    }

    getDistricts() {
        this.regionService.getDistricts().subscribe((res: any) => {
            this.districts = res.data;
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

    setListTps() {
        this.listTps = [];
        for (let index = 1; index <= 100; index++) {
            this.listTps.push({ id: index });
        }
    }

    setListTMS() {
        this.listTms = this.votersService.getListTms();
    }

    setListDisabilitas() {
        this.listDisabilitas = this.votersService.getDisabilities();
    }

}
