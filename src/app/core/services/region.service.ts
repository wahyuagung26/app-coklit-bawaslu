import { Injectable } from '@angular/core';
import { LandaService } from './landa.service';

@Injectable({
    providedIn: 'root'
})
export class RegionService extends LandaService {

    getDistricts(arrParameter = {}) {
        return this.DataGet('/v1/districts', arrParameter);
    }

    getVillages(districtsId, arrParameter = {}) {
        return this.DataGet(`/v1/districts/${districtsId}/villages`, arrParameter);
    }
}
