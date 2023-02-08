import { Component, Input, OnInit, Output, EventEmitter, SimpleChange } from '@angular/core';
import { LandaService } from 'src/app/core/services/landa.service';
import { RegionService } from 'src/app/core/services/region.service';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-form-user',
    templateUrl: './form-user.component.html',
    styleUrls: ['./form-user.component.scss']
})
export class FormUserComponent implements OnInit {
    readonly MODE_CREATE = 'add';
    readonly MODE_UPDATE = 'update';

    @Input() userId: number;
    @Output() afterSave = new EventEmitter<boolean>();

    activeMode: string;
    roles: any;
    districts: any;
    villages: any;
    formModel: {
        id: number,
        name: string,
        username: string,
        password: string,
        phone_number: string,
        role: string,
        district_id: string,
        village_id: string
    }

    constructor(
        private userService: UserService,
        private landaService: LandaService,
        private regionService: RegionService
    ) { }

    ngOnInit(): void { }

    ngOnChanges(changes: SimpleChange) {
        this.resetForm();
        this.getDistricts();
    }

    getRoles() {
        this.roles = [
            {
                'id': 'super admin',
                'name': 'Super Admin',
            },
            {
                'id': 'admin kabupaten',
                'name': 'Admin Kabupaten'
            },
            {
                'id': 'admin kecamatan',
                'name': 'Admin Kecamatan'
            },
            {
                'id': 'admin desa',
                'name': 'Admin Desa'
            },
        ];
    }

    resetForm() {
        this.getRoles();
        this.formModel = {
            id: 0,
            name: '',
            username: '',
            password: '',
            phone_number: '',
            role: '',
            district_id: '',
            village_id: ''
        }

        if (this.userId > 0) {
            this.activeMode = this.MODE_UPDATE;
            this.getUser(this.userId);
            return true;
        }

        this.activeMode = this.MODE_CREATE;
    }

    getUser(userId) {
        this.userService.getUserById(userId).subscribe((res: any) => {
            this.formModel = res.data;
            if(this.formModel.district_id) {
                this.getVillages(this.formModel.district_id);
            }
        }, err => {
            console.log(err);
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

    save() {
        switch (this.activeMode) {
            case this.MODE_CREATE:
                this.insert();
                break;
            case this.MODE_UPDATE:
                this.update();
                break;
        }
    }

    insert() {
        this.userService.createUser(this.formModel).subscribe((res: any) => {
            this.landaService.alertSuccess('Berhasil', res.message);
            this.afterSave.emit();
        }, err => {
            this.landaService.alertError('Mohon Maaf', err.error.errors);
        });
    }

    update() {
        this.userService.updateUser(this.formModel).subscribe((res: any) => {
            this.landaService.alertSuccess('Berhasil', res.message);
            this.afterSave.emit();
        }, err => {
            this.landaService.alertError('Mohon Maaf', err.error.errors);
        });
    }

}
