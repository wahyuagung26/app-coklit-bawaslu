import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { LoaderService } from './core/services/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})

export class AppComponent {

  constructor(
    private loaderService: LoaderService,
    private spinner: NgxSpinnerService
  ) {
    this.loaderService.isLoading.subscribe((showLoading) => {
      if (showLoading) {
        this.spinner.show();
      } else {
        this.spinner.hide();
      }
    })
  }
}
