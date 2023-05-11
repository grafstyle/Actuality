import { Component } from '@angular/core';
import { Users } from './controller/users/users';
import { AuthService } from '@auth0/auth0-angular';
import { Service } from './controller/services/services';
import { Posts } from './controller/posts/posts';
import { Comments } from './controller/comments/comments';
import { Likes } from './controller/likes/likes';
import { Router } from '@angular/router';
import { Cloudinary } from './controller/cloudinary/cloudinary';
import { CookieService } from 'ngx-cookie-service';
import { Cookies } from './cookies/cookies';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Actuality';

  search(e: Event) {
    const elem = e.target as HTMLInputElement;
    this.routerLink.navigateByUrl('/search?by=' + elem.value);
    elem.value = '';
  }

  async setCookies() {
    const emailName = (await Users.getByAuth()).email;
    let idName = (await Users.getByEmail(emailName)).id;
    if (Cookies.getUser() != ('' || null || undefined)) {
      if (idName == undefined) idName = 0;
      Cookies.setUser(idName);
    }
  }

  login() {
    Users.login();
    this.setCookies();
  }

  signup() {
    Users.signup();
    this.setCookies();
  }

  constructor(
    private auth: AuthService,
    private apiService: Service,
    private routerLink: Router,
    private cookies: CookieService
  ) {
    Users.apiService =
      Posts.apiService =
      Comments.apiService =
      Likes.apiService =
      Cloudinary.apiService =
        this.apiService;
    Cookies.cookies = this.cookies;
    Users.auth = this.auth;
  }
}
