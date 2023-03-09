import { Injectable } from '@angular/core';
import { CoreService } from './core.service';

@Injectable({
    providedIn: 'root'
})
export class RegionService extends CoreService {

    getDistricts(arrParameter = {}) {
        return this.DataGet('/v1/districts', arrParameter);
    }

    getVillages(districtsId, arrParameter = {}) {
        return this.DataGet(`/v1/districts/${districtsId}/villages`, arrParameter);
    }

    getVillageById(villageId) {
        return this.DataGet(`/v1/villages/${villageId}`);
    }

    lockVoters(villageId, statusDataId) {
        return this.DataPost(`/v1/voters/${statusDataId}/submit/${villageId}`);
    }
}
