import { Component } from '@angular/core';
import { Users } from './controller/users/users';
import { AuthService } from '@auth0/auth0-angular';
import { Service } from './controller/services/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Actuality';

  login() {
    Users.login();
  }

  signup() {
    Users.signup();
  }

  constructor(private auth: AuthService, private apiService: Service) {
    Users.apiService = this.apiService;
    Users.auth = this.auth;
  }
}
