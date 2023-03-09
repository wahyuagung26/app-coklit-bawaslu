import { Component, OnInit, Input, SimpleChanges } from '@angular/core';

@Component({
    selector: 'app-table-racap',
    templateUrl: './table-racap.component.html',
    styleUrls: ['./table-racap.component.scss']
})

export class TableRacapComponent implements OnInit {

    @Input() maleFieldName = '';
    @Input() femaleFieldName = '';
    @Input() list = [];
    @Input() user: any;

    grandTotal: 0;
    grandTotalMale: 0;
    grandTotalFemale: 0;

    constructor() { }

    ngOnInit(): void {
        this.grandTotal = 0;
        this.grandTotalMale = 0;
        this.grandTotalFemale = 0;
        this.user = {};
    }

    showDistrict() {
        const role = this.user?.role ?? '';
        return role != 'admin desa';
    }

    sumTotal(cell) {
        const total = cell.reduce(function (acc, val) { return acc + val; }, 0)
        return new Intl.NumberFormat().format(total);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes?.user?.currentValue?.length) {
            this.user = changes?.user?.currentValue?.length;
        }

        if (changes?.list?.currentValue?.length) {
            this.list = changes.list.currentValue;
            this.renderList(changes.list.currentValue);
        }

        if (changes?.maleFieldName?.currentValue) {
            this.maleFieldName = changes.maleFieldName.currentValue;
        }

        if (changes?.femaleFieldName?.currentValue) {
            this.femaleFieldName = changes.femaleFieldName.currentValue;
        }
    }

    renderList(list) {
        this.grandTotal = 0;
        this.grandTotalMale = 0;
        this.grandTotalFemale = 0;

        this.list = list.map((value) => {
            const male = value[this.maleFieldName] ?? 0;
            const female = value[this.femaleFieldName] ?? 0;

            this.grandTotal += male + female;
            this.grandTotalMale += male;
            this.grandTotalFemale += female;

            return {
                village_name: value.village_name ?? '',
                district_name: value.district_name ?? '',
                tps: value.tps ?? 0,
                total_male: male,
                total_female: female,
                total: male + female
            }
        });
    }
}
