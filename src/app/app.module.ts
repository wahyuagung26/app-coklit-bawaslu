import { AsyncPipe } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from "ngx-spinner";

import { HttpConfigInterceptor } from './core/interceptors/http-config.interceptor';
import { LayoutsModule } from './layouts/layouts.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './feature/auth/services/auth.service';
import { NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { CustomAdapter, CustomDateParserFormatter } from './core/adapter/datepicker-adapter';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        LayoutsModule,
        AppRoutingModule,
        HttpClientModule,
        NgxSpinnerModule
    ],
    providers: [
        AsyncPipe,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpConfigInterceptor,
            multi: true,
        },
        { provide: NgbDateAdapter, useClass: CustomAdapter },
		{ provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
    ],
    bootstrap: [AppComponent],
})

export class AppModule {
    constructor(private authService: AuthService) {
        if (this.authService.getToken() !== '') {
            this.authService.saveUserLogin();
        }
    }
}
