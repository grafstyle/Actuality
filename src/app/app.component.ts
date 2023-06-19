import { Component } from '@angular/core';
import { User, Users } from './controller/users/users';
import { AuthService } from '@auth0/auth0-angular';
import { Service } from './controller/services/services';
import { Posts } from './controller/posts/posts';
import { Comments } from './controller/comments/comments';
import { Likes } from './controller/likes/likes';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Cloudinary } from './controller/cloudinary/cloudinary';
import { CookieService } from 'ngx-cookie-service';
import { Cookies } from './cookies/cookies';
import { Tools } from './tools/tools';
import { RefreshService } from './tools/refresh-service/refresh-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  tools: Tools = new Tools();
  title = 'Actuality';

  search(e: Event) {
    const elem = e.target as HTMLInputElement;
    this.routerLink.navigateByUrl('/search?by=' + elem.value);
    elem.value = '';
  }

  async setCookies() {
    try {
      const emailName: string | undefined = (await Users.getByAuth()).email;
      let id: number | undefined = undefined;
      if (emailName != undefined) id = (await Users.getByEmail(emailName)).id;
      if (isNaN(Cookies.getUserID()) && id != undefined) Cookies.setUserID(id);
    } catch (err) {
      // Catch empty? 🤨
    }
  }

  goProfile() {
    if (isNaN(Cookies.getUserID())) this.router.navigateByUrl('/login');
    else this.router.navigateByUrl('/profile');
  }

  login() {
    Users.login();
  }

  signup() {
    Users.signup();
  }

  logout() {
    Users.logout();
    Cookies.deleteUserID();
  }

  constructor(
    private router: Router,
    private auth: AuthService,
    private apiService: Service,
    private routerLink: Router,
    private cookies: CookieService,
    private refresh: RefreshService
  ) {
    Users.apiService =
      Posts.apiService =
      Comments.apiService =
      Likes.apiService =
      Cloudinary.apiService =
        this.apiService;
    Cookies.cookies = this.cookies;
    Cookies.refresh = this.refresh;
    Users.auth = this.auth;

    router.events.subscribe({
      next: (e: any) => {
        if (e instanceof NavigationEnd) {
          if (e.url == '/profile')
            if (isNaN(Cookies.getUserID())) router.navigateByUrl('/login');
          if (e.url == '/login') this.login();
          if (e.url == '/signup') this.signup();
        }
      },
    });
  }

  async ngOnInit(): Promise<void> {
    const isAuth: boolean = await Users.isActualUserAuth();
    if (isAuth)
      this.auth.user$.subscribe({
        next: (actualUser) => {
          if (actualUser != undefined) {
            Users.post({
              name: this.tools.convIfUndefined(actualUser?.given_name),
              email: this.tools.convIfUndefined(actualUser?.email),
              url_name: this.tools.createURLName(
                this.tools.convIfUndefined(actualUser?.given_name)
              ),
              image: this.tools.convIfUndefined(actualUser?.picture),
              joined: this.tools.convIfUndefined(actualUser?.updated_at),
              bio: '',
              portrait: '',
              followed: [],
              followers: [],
            });

            this.setCookies();
          }
        },
      });
  }
}
