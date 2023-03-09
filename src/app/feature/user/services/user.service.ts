import { Injectable } from '@angular/core';
import { CoreService } from 'src/app/core/services/core.service';

@Injectable({
    providedIn: 'root'
})
export class UserService extends CoreService {

    getRoles(arrParameter = {}) {
        return this.DataGet('/v1/roles', arrParameter);
    }

    getUsers(arrParameter = {}) {
        return this.DataGet('/v1/users', arrParameter);
    }

    getUserById(userId) {
        return this.DataGet('/v1/users/' + userId);
    }

    createUser(payload) {
        return this.DataPost('/v1/users', payload);
    }

    updateUser(payload) {
        return this.DataPut('/v1/users', payload);
    }

    deleteUser(userId) {
        return this.DataDelete('/v1/users/' + userId);
    }
}
