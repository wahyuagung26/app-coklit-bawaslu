import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-form-filter',
    templateUrl: './form-filter.component.html',
    styleUrls: ['./form-filter.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FormFilterComponent implements OnInit {
    listTps = [];
    constructor(
        private modalService: NgbModal
    ) { }

    ngOnInit(): void {
        for (let index = 1; index <= 10; index++) {
            this.listTps.push({ id: index });
        }
    }

    openModal(content) {
        this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', windowClass: 'right full-height' });
    }

}
