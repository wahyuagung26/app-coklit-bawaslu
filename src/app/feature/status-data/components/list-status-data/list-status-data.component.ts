import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { RegionService } from 'src/app/core/services/region.service';
import { AuthService } from 'src/app/feature/auth/services/auth.service';
import { StatusDataService } from '../../services/status-data.service';

@Component({
    selector: 'app-list-status-data',
    templateUrl: './list-status-data.component.html',
    styleUrls: ['./list-status-data.component.scss']
})
export class ListStatusDataComponent implements OnInit {

    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    dtInstance: Promise<DataTables.Api>;
    dtOptions: any;

    districtId: any;
    userLogin: any;
    districts: any;
    listStatusData: any;
    titleModal: string;
    userId: number;
    filter: {
        district_id: '',
    };

    constructor(
        public authService: AuthService,
        private statusDataService: StatusDataService,
        private regionService: RegionService
    ) { 
        this.userLogin = this.authService.getUser();
        this.districtId = this.userLogin?.district_id;
    }

    setDefault() {
        this.filter = {
            district_id: this.districtId,
        }
    }

    ngOnInit(): void {
        this.setDefault();
        this.getDistricts();

        this.getList();
    }

    getList() {
        this.dtOptions = {
            serverSide: true,
            processing: true,
            ordering: false,
            pageLength: 25,
            ajax: (dtParams: any, callback) => {
                const params = {
                    ...this.filter,
                    per_page: dtParams.length,
                    page: (dtParams.start / dtParams.length) + 1,
                };

                this.statusDataService.getVillages(params).subscribe((res: any) => {
                    const { data, meta } = res;

                    let number = dtParams.start + 1;
                    data.forEach(val => (val.no = number++));
                    this.listStatusData = data;

                    callback({
                        recordsTotal: meta.total_item,
                        recordsFiltered: meta.total_item,
                        data: [],
                    });

                }, (err: any) => {

                });
            },
        };
    }

    reloadDataTable(): void {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.draw();
        });
    }

    getDistricts() {
        this.regionService.getDistricts().subscribe((res: any) => {
            this.districts = res.data;
        }, err => {
            console.log(err);
        });
    }
}
