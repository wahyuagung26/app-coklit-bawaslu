import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { VotersService } from '../../services/voters.service';
import { AuthService } from '../../../auth/services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-list-voters',
    templateUrl: './list-voters.component.html',
    styleUrls: ['./list-voters.component.scss'],
    encapsulation: ViewEncapsulation.None,
})

export class ListVotersComponent implements OnInit {
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
    totalCoklit: number;
    totalUnCoklit: number;
    listTps: any;
    listTms: any;
    listCoklit: any;
    listDisabilitas: any;
    listVoters: any;
    listMarried: any;
    listGender: any;
    listBoolean: any;
    userLogin: any;
    filter: {
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
        is_checked: ''
    };

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private votersService: VotersService,
        private authService: AuthService,
        private modalService: NgbModal
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

            this.statusDataId = parseInt(params.voterId);
            const voter = this.statusData.filter((val) => (val.id == params.voterId));
            this.statusDataName = `${voter?.[0]?.text} ` ?? `Data `;


            this.fetchData();
            this.getSummaries();
            this.resetFilter();
        });

        this.authService.getProfile().subscribe((user: any) => {
            this.userLogin = user;

            this.setDistrict(user.district_id, user.district_name);
            this.setVillage(user.village_id, user.village_name);
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
            is_checked: ''
        }
    }

    openModal(content) {
        this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', windowClass: 'right full-height' });
    }

    getSummaries() {
        if(this.statusDataId > 1) return false;

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

    setDistrict(districtId, districtName: string) {
        this.districtName = districtName;
        this.districtId = districtId;
    }

    setVillage(villageId, villageName: string) {
        this.villageName = villageName;
        this.villageId = villageId;
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
