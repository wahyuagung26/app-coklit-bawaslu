import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
    selector: 'app-recap-tms',
    templateUrl: './recap-tms.component.html',
    styleUrls: ['./recap-tms.component.scss']
})
export class RecapTmsComponent implements OnInit {
    @Input() list = [];
    @Input() user: any;

    total: {
        tps,
        unknown_m,
        unknown_f,
        pass_away_m,
        pass_away_f,
        double_m,
        double_f,
        minor_m,
        minor_f,
        tni_m,
        tni_f,
        polri_m,
        polri_f,
        grand_total
    };

    constructor() { }

    ngOnInit(): void {
        this.list = [];
        this.user = {};
        this.resetTotal();
    }

    showDistrict() {
        const role = this.user?.role ?? ''; 
        return role != 'admin desa';
    }

    resetTotal() {
        this.total = {
            tps: 0,
            unknown_m: 0,
            unknown_f: 0,
            pass_away_m: 0,
            pass_away_f: 0,
            double_m: 0,
            double_f: 0,
            minor_m: 0,
            minor_f: 0,
            tni_m: 0,
            tni_f: 0,
            polri_m: 0,
            polri_f: 0,
            grand_total: 0
        };
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes?.user?.currentValue?.length) {
            this.user = changes?.user?.currentValue?.length;
        }

        if (changes?.list?.currentValue?.length) {
            this.resetTotal();
            this.list = changes.list.currentValue.map(val => {
                val.total = val.unknown_m +
                    val.unknown_f +
                    val.pass_away_m +
                    val.pass_away_f +
                    val.double_m +
                    val.double_f +
                    val.minor_m +
                    val.minor_f +
                    val.tni_m +
                    val.tni_f +
                    val.polri_m +
                    val.polri_f

                this.total.tps += val.tps;
                this.total.unknown_m += val.unknown_m;
                this.total.unknown_f += val.unknown_f;
                this.total.pass_away_m += val.pass_away_m;
                this.total.pass_away_f += val.pass_away_f;
                this.total.double_m += val.double_m;
                this.total.double_f += val.double_f;
                this.total.minor_m += val.minor_m;
                this.total.minor_f += val.minor_f;
                this.total.tni_m += val.tni_m;
                this.total.tni_f += val.tni_f;
                this.total.polri_m += val.polri_m;
                this.total.polri_f += val.polri_f;
                this.total.grand_total += val.total;

                return val;
            });
        }
    }

}
