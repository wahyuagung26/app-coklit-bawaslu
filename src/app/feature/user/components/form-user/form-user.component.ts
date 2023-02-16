import { Component, Input, OnInit, Output, EventEmitter, SimpleChange } from '@angular/core';
import { CoreService } from 'src/app/core/services/core.service';
import { RegionService } from 'src/app/core/services/region.service';
import { AuthService } from 'src/app/feature/auth/services/auth.service';
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
    userLogin: any;
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
        private coreService: CoreService,
        private regionService: RegionService,
        private authService: AuthService
    ) {
        this.userLogin = this.authService.getUser();
    }

    ngOnInit(): void { }

    ngOnChanges(changes: SimpleChange) {
        this.resetForm();
        this.getDistricts();
    }

    getRoles() {
        if (this.userLogin?.role == 'super admin') {
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

        if (this.userLogin?.role == 'admin kabupaten') {
            this.roles = [
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

        if (this.userLogin?.role == 'admin kecamatan') {
            this.roles = [
                {
                    'id': 'admin desa',
                    'name': 'Admin Desa'
                },
            ];
        }

    }

    resetForm() {
        this.getRoles();
        this.formModel = {
            id: 0,
            name: '',
            username: '',
            password: '',
            phone_number: '',
            role: 'admin desa',
            district_id: this.userLogin?.district_id ?? 0,
            village_id: this.userLogin?.village_id ?? 0
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
            this.getVillages(res.data.district_id);
        }, err => {
            console.log(err);
        });
    }

    getDistricts() {
        this.regionService.getDistricts().subscribe((res: any) => {
            this.districts = res.data;

            if (this.userLogin?.district_id && this.userId < 1) {
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
            this.coreService.alertSuccess('Berhasil', res.message);
            this.afterSave.emit();
        }, err => {
            this.coreService.alertError('Mohon Maaf', err.error.errors);
        });
    }

    update() {
        this.userService.updateUser(this.formModel).subscribe((res: any) => {
            this.coreService.alertSuccess('Berhasil', res.message);
            this.afterSave.emit();
        }, err => {
            this.coreService.alertError('Mohon Maaf', err.error.errors);
        });
    }

}
