import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { VotersService } from '../../services/voters.service';
import { AuthService } from '../../../auth/services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegionService } from 'src/app/core/services/region.service';
import { CoreService } from 'src/app/core/services/core.service';

@Component({
    selector: 'app-list-voters',
    templateUrl: './list-voters.component.html',
    styleUrls: ['./list-voters.component.scss'],
    encapsulation: ViewEncapsulation.None,
})

export class ListVotersComponent implements OnInit {
    modalReference: any;
    page: {
        total_item: any,
        page: any,
        per_page: any,
    };

    editing: any;
    statusDataId: number;
    statusDataName: string;
    statusData: any;
    districtId: string;
    districtName: string;
    villageId: string;
    villageName: string;
    villageLastStatusId: number;
    totalCoklit: number;
    totalUnCoklit: number;
    totalUnchecked: number;
    listTps: any;
    listTms: any;
    listCoklit: any;
    listDisabilitas: any;
    listVoters: any;
    listMarried: any;
    listGender: any;
    listBoolean: any;
    userLogin: any;
    isAllowEdit: any;
    districts: any;
    villages: any;
    filter: {
        name,
        nik,
        nkk,
        rt,
        rw,
        tps,
        married_status,
        is_coklit,
        is_new_voter,
        is_novice_voter,
        tms,
        disabilities,
        is_profile_updated,
        is_checked,
        district_id,
        village_id
    };

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private votersService: VotersService,
        private authService: AuthService,
        private modalService: NgbModal,
        private regionService: RegionService,
        private coreService: CoreService
    ) {
        this.statusData = environment.statusData;
        this.page = {
            total_item: 0,
            page: 1,
            per_page: 25,
        };
        this.editing = {};
    }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe(params => {
            if (params.voterId > 6) {
                this.router.navigate(['/home']);
            }

            const voter = this.statusData.filter((val) => (val.id == params.voterId));
            this.statusDataName = `${voter?.[0]?.text} ` ?? `Data `;
            this.statusDataId = parseInt(params.voterId);

            this.userLogin = this.authService.getUser();
            this.isAllowEdit = false;
            this.totalUnchecked = 0;

            this.districtId = this.userLogin.district_id;
            this.districtName = (this.userLogin?.district_name ?? '').toLowerCase();
            this.villageId = this.userLogin.village_id;

            this.getVillages(this.userLogin.district_id);
            this.getDistricts();
            this.getDetailVillage();

            this.fetchData({ page: 1 });
            this.getSummaries();
            this.resetFilter();
        });

        this.setListTps();
        this.setListCoklit();
        this.setListTMS();
        this.setListDisabilitas();
        this.setListGender();
        this.setListMarriedStatus();
        this.setListBoolean();
    }

    resetFilter() {
        this.filter = {
            name: '',
            nik: '',
            nkk: '',
            rt: '',
            rw: '',
            tps: '',
            married_status: '',
            is_coklit: '',
            is_new_voter: '',
            is_novice_voter: '',
            tms: '',
            disabilities: '',
            is_profile_updated: '',
            is_checked: '',
            district_id: this.userLogin.district_id,
            village_id: this.userLogin.village_id,
        }
    }

    openModal(content, windowClass = '') {
        this.votersService.getTotalUnChecked(this.statusDataId, this.villageId).subscribe((resp: any) => {
            this.totalUnchecked = resp.data?.total_unchecked ?? 0;
            if (this.statusDataId == 1) {
                this.totalUnCoklit = resp.data?.total_uncoklit ?? 0;
            }

            this.modalReference = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', windowClass: windowClass });
        }, err => {

        });
    }

    export() {
        window.open(`${environment.apiURL}/v1/voters/${this.statusDataId}/export/excel?village_id=${this.villageId}&district_id=${this.districtId}`);
    }

    getSummaries() {
        if (this.statusDataId > 1) {
            this.totalCoklit = 0;
            this.totalUnCoklit = 0;
            return false;
        };

        this.votersService.getCoklitSummary(this.statusDataId, this.villageId ?? 0).subscribe((res: any) => {
            this.totalCoklit = res.data.total_coklit;
            this.totalUnCoklit = res.data.total_uncoklit;
        });
    }

    getVoters(params = null) {
        let query = {
            ...params,
            page: (params?.offset ?? 0) + 1
        }

        this.votersService.getVoters(this.statusDataId, query).subscribe((res: any) => {
            const { data, meta } = res;
            this.listVoters = data;
            this.page = {
                total_item: meta.total_item,
                per_page: meta.per_page,
                page: meta.page
            };
        }, (err: any) => {

        });
    }

    fetchData(pageInfo = {}) {
        let query = {
            ...this.filter,
            ...pageInfo
        }
        this.getVoters(query);
    }

    setGenderValue(gender) {
        return gender == 'Laki-Laki' ? 1 : 2;
    }

    setStatusMarriedValue(status) {
        return status == 'Belum Kawin' ? 1 : 2;
    }

    updateProfile(event, cell, rowIndex) {
        let payload = {
            id: this.listVoters[rowIndex]['id'],
        }

        if (cell == 'gender') {
            payload[cell] = this.setGenderValue(event.target.value);
        } else if (cell == 'married_status') {
            payload[cell] = this.setStatusMarriedValue(event.target.value);
        } else {
            payload[cell] = event.target.value;
        }

        this.editing[rowIndex + '-' + cell] = false;
        this.votersService.updateProfile(this.statusDataId, payload).subscribe((res: any) => {
            this.listVoters[rowIndex][cell] = res.data[cell];
            this.listVoters[rowIndex].is_profile_updated = res.data.is_profile_updated;
            this.listVoters = [...this.listVoters];
        });
    }

    updateStatus(event, cell, rowIndex) {
        let payload = {
            id: this.listVoters[rowIndex]['id'],
        }
        payload[cell] = event.target.value;

        this.editing[rowIndex + '-' + cell] = false;
        this.votersService.updateStatus(this.statusDataId, payload).subscribe((res: any) => {
            this.listVoters[rowIndex][cell] = res.data[cell];
            this.listVoters = [...this.listVoters];
        });
    }

    updateCheckbox(_event, cell, rowIndex) {
        let payload = {
            id: this.listVoters[rowIndex]['id'],
        }

        payload[cell] = !this.listVoters[rowIndex][cell];

        this.editing[rowIndex + '-' + cell] = false;
        this.votersService.updateStatus(this.statusDataId, payload).subscribe((res: any) => {
            this.listVoters[rowIndex][cell] = res.data[cell];
            this.listVoters = [...this.listVoters];

            if (cell == 'is_coklit') {
                this.getSummaries();
            }
        });
    }

    saveAndLock() {
        this.regionService.lockVoters(this.villageId, this.statusDataId).subscribe((res: any) => {
            this.coreService.alertSuccess('Berhasil', res.message);
            this.modalReference.dismiss();
            this.redirectNextData();
        }, res => {
            this.coreService.alertError('Gagal', res.error.message);
        });
    }

    getDetailVillage() {
        this.regionService.getVillageById(this.villageId).subscribe((res: any) => {
            this.villageId = res.data.id;
            this.villageName = res.data.village_name.toLowerCase();
            this.villageLastStatusId = res.data.last_data_status_id;
            this.districtId = res.data.district_id;

            if (this.userLogin.role == 'admin desa' && this.villageLastStatusId == this.statusDataId) {
                this.isAllowEdit = true;
            } else {
                this.isAllowEdit = false;
            }
        });
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

    redirectNextData() {
        if (this.statusDataId < 6) {
            window.location.href = `/voters/${this.statusDataId + 1}`;
        }
    }

    setListTps() {
        this.listTps = [];
        for (let index = 1; index <= 100; index++) {
            this.listTps.push({ id: index });
        }
    }

    setListCoklit() {
        this.listCoklit = this.votersService.getListCoklit();
    }

    setListTMS() {
        this.listTms = this.votersService.getListTms();
    }

    setListDisabilitas() {
        this.listDisabilitas = this.votersService.getDisabilities();
    }

    setListMarriedStatus() {
        this.listMarried = this.votersService.getListMarriedStatus();
    }

    setListGender() {
        this.listGender = this.votersService.getListGender();
    }

    setListBoolean() {
        this.listBoolean = this.votersService.getListBoolean();
    }

}
