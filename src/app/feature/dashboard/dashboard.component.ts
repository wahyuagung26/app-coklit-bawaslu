import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

  user: any;

  constructor(private authService: AuthService) {
      this.authService.getProfile().subscribe((user: any) => {
          this.user = user;
      });
  }

  ngOnInit(): void {

  }

}
