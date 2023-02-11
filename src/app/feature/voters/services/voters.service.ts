import { Injectable } from '@angular/core';
import { CoreService } from 'src/app/core/services/core.service';

@Injectable({
    providedIn: 'root'
})
export class VotersService extends CoreService {

    getVoters(statusDataId: number, arrParameter = {}) {
        return this.DataGet(`/v1/voters/${statusDataId}`, arrParameter);
    }

    getCoklitSummary(statusDataId, villageId) {
        return this.DataGet(`/v1/voters/${statusDataId}/status/${villageId}/coklit`);
    }

    getTotalUnChecked(statusDataId, villageId) {
        return this.DataGet(`/v1/voters/${statusDataId}/status/${villageId}/unchecked`);
    }

    getRecap(statusDataId, arrParameter = {}) {
        return this.DataGet(`/v1/summaries/${statusDataId}`, arrParameter);
    }

    updateProfile(statusDataId, payload) {
        return this.DataPut(`/v1/voters/${statusDataId}/profile`, payload);
    }

    updateStatus(statusDataId, payload) {
        return this.DataPut(`/v1/voters/${statusDataId}/status`, payload);
    }

    save(statusDataId, payload) {
        return this.DataPost(`/v1/voters/${statusDataId}`, payload);
    }

    getDisabilities() {
        return [
            {
                id: 0,
                name: 'Normal'
            },
            {
                id: 1,
                name: 'Kode 1'
            },
            {
                id: 2,
                name: 'Kode 2'
            },
            {
                id: 3,
                name: 'Kode 3'
            },
            {
                id: 4,
                name: 'Kode 4'
            },
            {
                id: 5,
                name: 'Kode 5'
            },
            {
                id: 6,
                name: 'Kode 6'
            },
            {
                id: 7,
                name: 'Kode 7'
            },
            {
                id: 8,
                name: 'Kode 8'
            },
        ];
    }

    getListTms() {
        return [
            {
                id: 0,
                name: 'Bukan TMS'
            },
            {
                id: 1,
                name: 'Tidak Dikenal'
            },
            {
                id: 2,
                name: 'Meninggal'
            },
            {
                id: 3,
                name: 'Ganda'
            },
            {
                id: 4,
                name: 'Belum Cukup Umur'
            },
            {
                id: 5,
                name: 'TNI'
            },
            {
                id: 6,
                name: 'POLRI'
            }
        ];
    }

    getListCoklit() {
        return [
            {
                id: 0,
                name: 'Belum'
            },
            {
                id: 1,
                name: 'Sudah'
            }
        ];
    }

    getListMarriedStatus() {
        return [
            {
                id: 1,
                name: 'Belum Kawin'
            },
            {
                id: 2,
                name: 'Sudah Kawin'
            }
        ];
    }

    getListGender() {
        return [
            {
                id: 1,
                name: 'Laki-Laki'
            },
            {
                id: 2,
                name: 'Perempuan'
            }
        ];
    }

    getListBoolean() {
        return [
            {
                id: 1,
                name: 'Sudah'
            },
            {
                id: 2,
                name: 'Belum'
            }
        ];
    }
}
