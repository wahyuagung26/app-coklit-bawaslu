import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-recap',
    templateUrl: './recap.component.html',
    styleUrls: ['./recap.component.scss']
})
export class RecapComponent implements OnInit {
    districtName: string;
    votersType: any;

    constructor(
    ) {
    }

    ngOnInit(): void {
        this.votersType = environment.votersType;
        this.districtName = 'Kelurahan Lawang';
    }

}
