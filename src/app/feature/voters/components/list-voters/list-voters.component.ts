import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { VotersService } from '../../services/voters.service';
import { AuthService } from '../../../auth/services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegionService } from 'src/app/core/services/region.service';
import { CoreService } from 'src/app/core/services/core.service';
import { LoaderService } from 'src/app/core/services/loader.service';

@Component({
    selector: 'app-list-voters',
    templateUrl: './list-voters.component.html',
    styleUrls: ['./list-voters.component.scss'],
    encapsulation: ViewEncapsulation.None,
})

export class ListVotersComponent implements OnInit {
    DEFAULT_ERROR_MESSAGE = 'Server sedang sibuk coba lagi nanti';

    base64Output: string;
    modalReference: any;
    page: {
        total_item: any,
        page: any,
        per_page: any,
    };
    fileUpload: any;
    editing: any;
    statusDataId: number;
    statusDataName: string;
    statusData: any;
    districtId: any;
    districtName: string;
    villageId: any;
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
    massAction: {
        isCoklit: boolean,
        isChecked: boolean
    };
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
        village_id,
    };

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private votersService: VotersService,
        private authService: AuthService,
        private modalService: NgbModal,
        private regionService: RegionService,
        private coreService: CoreService,
        private loaderService: LoaderService
    ) {
        this.statusData = environment.statusData;
        this.page = {
            total_item: 0,
            page: 1,
            per_page: 20,
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
            this.listVoters = [];

            this.getDistricts();
            this.getVillages(this.userLogin.district_id);

            this.resetPayload();
        });

        this.setListTps();
        this.setListCoklit();
        this.setListTMS();
        this.setListDisabilitas();
        this.setListGender();
        this.setListMarriedStatus();
        this.setListBoolean();
    }

    resetPayload() {
        this.fileUpload = null;
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

        this.massAction = {
            isCoklit: false,
            isChecked: false
        };
    }

    openModal(content, windowClass = '', checkStatus = false) {
        if (!checkStatus) {
            this.modalReference = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', windowClass: windowClass });
            return true;
        }

        this.loaderService.show();
        this.votersService.getTotalUnChecked(this.statusDataId, this.filter.village_id, this.filter.district_id).subscribe((resp: any) => {
            this.totalUnchecked = resp.data?.total_unchecked ?? 0;
            if (this.statusDataId == 1) {
                this.totalUnCoklit = resp.data?.total_uncoklit ?? 0;
            }

            this.modalReference = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', windowClass: windowClass });
        }, resp => {

        });
    }

    export() {
        window.open(`${environment.apiURL}/v1/voters/${this.statusDataId}/export/excel?village_id=${this.villageId}&district_id=${this.districtId}`);
    }

    import(event) {
        if (event.target.files[0]) {
            this.convertFile(event.target.files[0]).subscribe(base64 => {
                this.loaderService.show();
                this.votersService.uploadFile(base64).subscribe((res: any) => {
                    setTimeout(() => {
                        this.loaderService.show();
                        this.votersService.runImport(this.districtId, this.villageId).subscribe((res: any) => {
                            this.coreService.alertSuccess('Berhasil', res.message);
                        });
                    }, 1000)
                });
            });
        }
    }

    convertFile(file: File): Observable<string> {
        const result = new ReplaySubject<string>(1);
        const reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = (event) => result.next(btoa(event.target.result.toString()));
        return result;
    }

    getTotalCoklit() {
        if (this.statusDataId > 1) {
            this.totalCoklit = 0;
            this.totalUnCoklit = 0;
            return false;
        };

        this.votersService.getCoklitSummary(this.statusDataId, this.filter.village_id ?? 0, this.filter.district_id ?? 0).subscribe((res: any) => {
            this.totalCoklit = res.data.total_coklit;
            this.totalUnCoklit = res.data.total_uncoklit;
        });
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

    getVoters(params = null) {
        let query = {
            ...params,
            page: (params?.offset ?? 0) + 1,
            per_page: this.page.per_page
        }

        this.setVillageName();
        this.setDistrictName();

        this.villageId = this.filter.village_id;
        this.districtId = this.filter.district_id;

        if (this.userLogin.role != 'admin desa' && this.statusDataId == 1) {
            this.getTotalCoklit();
        }

        this.loaderService.show();
        this.votersService.getVoters(this.statusDataId, query).subscribe((res: any) => {
            const { data, meta } = res;
            this.listVoters = data;
            this.page = {
                total_item: meta.total_item,
                per_page: meta.per_page,
                page: meta.page
            };
        }, (res: any) => {

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
                this.getTotalCoklit();
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
            res.data.forEach(val => {
                if (this.userLogin.role == 'admin desa' && this.userLogin.village_id == val.id) {
                    this.villageId = val.id;
                    this.villageName = val.village_name.toLowerCase();
                    this.villageLastStatusId = val.last_data_status_id;
                    this.districtId = val.district_id;
                    this.filter.village_id = val.id;
                    this.filter.district_id = val.district_id;
                }

                if (this.userLogin.role == 'admin desa' && this.userLogin.village_id == val.id && this.userLogin.last_data_status_id == this.statusDataId) {
                    this.isAllowEdit = true;
                }

                if (this.userLogin.role != 'admin desa') {
                    this.isAllowEdit = false;
                    this.filter.village_id = val.id;
                }
            });

            this.fetchData();
            this.getTotalCoklit();
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

    coklitAll() {
        const payload = {
            village_id: this.filter.village_id,
            district_id: this.filter.district_id,
            is_coklit: !this.massAction.isCoklit
        };

        this.votersService.coklitAll(this.statusDataId, payload).subscribe((resp: any) => {
            this.coreService.alertSuccess('Berhasil', resp.message);
            this.getTotalCoklit();
            this.fetchData();
        }, (resp) => {
            this.coreService.alertError('Gagal', resp?.error?.message ?? this.DEFAULT_ERROR_MESSAGE);
        });
    }

    checklistAll() {
        const payload = {
            village_id: this.filter.village_id,
            district_id: this.filter.district_id,
            is_checked: !this.massAction.isChecked
        };

        this.votersService.checklistAll(this.statusDataId, payload).subscribe((resp: any) => {
            this.coreService.alertSuccess('Berhasil', resp.message);
            this.fetchData();
        }, (resp) => {
            this.coreService.alertError('Gagal', resp?.error?.message ?? this.DEFAULT_ERROR_MESSAGE);
        });
    }
}
