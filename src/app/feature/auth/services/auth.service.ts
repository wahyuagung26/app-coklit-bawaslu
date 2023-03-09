import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StateService } from 'src/app/core/services/state.service';
import { CoreService } from '../../../core/services/core.service'

const initialState = {
    userLogin: {
        id: '',
        nama: '',
        email: '',
        user_profile: '',
    },
};

@Injectable({
    providedIn: 'root'
})

export class AuthService extends StateService<any>{
    userLogin: Observable<any> = this.select(state => state.userLogin);

    constructor(private coreService: CoreService) {
        super(initialState);
    }

    /**
     * Check if user has access to feature
     */
    checkAccess(access: String) {
        let userLogin: any;
        this.getProfile().subscribe((user: any) => (userLogin = user));
        if (userLogin.id == '') {
            return false;
        }

        const permission = access.split('|');
        if (permission.includes(userLogin.role)) {
            return true;
        }

        return false;
    }

    /**
     * Request login
     */
    login(username, password) {
        return this.coreService.DataPost('/v1/login', {
            username: username,
            password: password
        });
    }

    /**
     * Ambil token CSRF dari server dan simpan di localStorage
     */
    saveCsrf() {
        this.coreService.DataGet('/v1/csrf').subscribe((res: any) => {
            return new Promise((resolve, reject) => {
                localStorage.setItem('csrf', res.data);
                resolve(true);
            });
        });
    }

    /**
     * Ambil token CSRF dari localStorage
     */
    getCsrf() {
        const token = localStorage.getItem('csrf');
        if (token) {
            return token;
        }

        return '';
    }

    /**
     * Logout
     */
    logout() {
        this.removeToken();
        this.setState({
            userLogin: {
                id: '',
                nama: '',
                email: '',
                user_profile: '',
            },
        })
    }

    /**
     * Ambil profile user yang login dari state management
     */
    getProfile() {
        return this.select(state => state.userLogin);
    }

    /**
     * 
     * Ambil detail user dari local storage
     */
    getUser() {
        const user = localStorage.getItem('user');
        if (user) {
            return JSON.parse(user);
        }

        return '';
    }

    /**
     * Ambil user yang login ke server
     * dan simpan di RxJS
     */
    saveUserLogin() {
        return this.coreService.DataGet('/v1/profile').subscribe((res: any) => {
            /**
             * @todo remove setState
             */
            this.setState({ userLogin: res.data });
            localStorage.setItem('user', JSON.stringify(res.data));
        });
    }

    /**
    * Simpan token user ke localstorage
    */
    saveToken(payload: any) {
        return new Promise((resolve, reject) => {
            localStorage.setItem('token', payload);
            resolve(true);
        });
    }

    /**
     * Hapus user dari local Storage
     */
    removeToken() {
        return new Promise((resolve, reject) => {
            localStorage.removeItem('token');
            resolve(true);
        });
    }

    /**
     * Ambil token user dari localstorage
     */
    getToken() {
        const token = localStorage.getItem('token');
        if (token) {
            return token;
        }

        return '';
    }
}
