import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-counter',
    templateUrl: './counter.component.html',
    styleUrls: ['./counter.component.scss']
})
export class CounterComponent implements OnInit {
    total: number;
    totalCoklit: number;
    totalNonCoklit: number;

    constructor() { }

    ngOnInit(): void {
        this.total = 0;
        this.totalCoklit = 0;
        this.totalNonCoklit = 0;
    }

}
