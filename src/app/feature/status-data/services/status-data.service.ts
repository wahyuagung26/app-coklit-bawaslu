import { Injectable } from '@angular/core';
import { CoreService } from 'src/app/core/services/core.service';

@Injectable({
    providedIn: 'root'
})
export class StatusDataService extends CoreService {

    getVillages(arrParameter = {}) {
        return this.DataGet('/v1/status-data', arrParameter);
    }
}
