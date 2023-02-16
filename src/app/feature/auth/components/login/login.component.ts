import { Component, OnInit, AfterViewInit } from '@angular/core';

import { CoreService } from '../../../../core/services/core.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})

/**
 * Login component
 */
export class LoginComponent implements OnInit, AfterViewInit {

    username: string;
    password: string;

    constructor(
        private authService: AuthService,
        private coreService: CoreService,
        private router: Router,
    ) {
        if (this.authService.getToken() !== '') {
            this.router.navigate(['/home']);
        }
    }

    ngOnInit() { }

    ngAfterViewInit() {
    }

    login() {
        this.authService.login(this.username, this.password).subscribe((res: any) => {
            this.authService.saveToken(res.data.token);
            this.authService.saveUserLogin();
            setTimeout(() => {
                window.location.href = `/home`;
            }, 1000)
        }, (err: any) => {
            this.coreService.alertError('Mohon Maaf', err?.error?.message);
        });
    }
}
