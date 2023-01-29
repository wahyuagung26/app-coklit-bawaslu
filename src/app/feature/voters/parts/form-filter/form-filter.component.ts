import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-form-filter',
    templateUrl: './form-filter.component.html',
    styleUrls: ['./form-filter.component.scss']
})
export class FormFilterComponent implements OnInit {
    listTps = [];
    constructor() { }

    ngOnInit(): void {
        for (let index = 1; index <= 10; index++) {
            this.listTps.push({ id: index });
        }
    }

}
