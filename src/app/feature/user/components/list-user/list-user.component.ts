import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/feature/auth/services/auth.service';
import Swal from 'sweetalert2';

import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-list-user',
    templateUrl: './list-user.component.html',
    styleUrls: ['./list-user.component.scss']
})

export class ListUserComponent implements OnInit {
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    dtInstance: Promise<DataTables.Api>;
    dtOptions: any;

    listUser: any;
    titleModal: string;
    userId: number;
    filter: {
        name: ''
    };

    constructor(
        public authService: AuthService,
        private userService: UserService,
        private modalService: NgbModal,
    ) { }

    setDefault() {
        this.filter = {
            name: ''
        }
    }

    ngOnInit(): void {
        this.setDefault();
        this.getUser();
    }

    getUser() {
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

                this.userService.getUsers(params).subscribe((res: any) => {
                    const { data, meta } = res;

                    let number = dtParams.start + 1;
                    data.forEach(val => (val.no = number++));
                    this.listUser = data;

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

    createUser(modalId) {
        this.titleModal = 'Tambah User';
        this.userId = 0;
        this.modalService.open(modalId, { size: 'lg', backdrop: 'static' });
    }

    updateUser(modalId, user) {
        this.titleModal = 'Edit User: ' + user.name;
        this.userId = user.id;
        this.modalService.open(modalId, { size: 'lg', backdrop: 'static' });
    }

    deleteUser(userId) {
        Swal.fire({
            title: 'Apakah kamu yakin ?',
            text: 'User ini tidak dapat login setelah kamu menghapus datanya',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#34c38f',
            cancelButtonColor: '#f46a6a',
            confirmButtonText: 'Ya, Hapus data ini !',
        }).then((result) => {
            if (!result.value) return false;

            this.userService.deleteUser(userId).subscribe((res: any) => {
                this.reloadDataTable();
            });
        });
    }

}
