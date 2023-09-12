import { Component } from '@angular/core';
import { Cookies } from '../cookies/cookies';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  constructor(private router: Router) {}

  goToFollowed(): void {
    if (!isNaN(Cookies.getUserID())) this.router.navigateByUrl('/followed');
    else this.router.navigateByUrl('/login');
  }
}
