import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { User, Users } from './controller/users/users';
import { AuthService } from '@auth0/auth0-angular';
import { Service } from './controller/services/services';
import { Posts } from './controller/posts/posts';
import { Comments } from './controller/comments/comments';
import { Likes } from './controller/likes/likes';
import { NavigationEnd, Router } from '@angular/router';
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
export class AppComponent implements OnInit {
  tools: Tools = new Tools();

  s_color: string = '#fff';
  txt_color: string = '#000';
  txt_s_color: string = '#fff';
  left_of_circle: string = '0';
  bg_of_light: string = 'var(--p_color)';
  bg_of_dark: string = 'var(--contrast_dark)';
  title = 'Actuality';
  screen_w: number = window.innerWidth;

  @ViewChild('menu_open') menu_open!: ElementRef<HTMLDivElement>;
  @ViewChild('menu_close') menu_close!: ElementRef<HTMLDivElement>;
  @ViewChild('menu_open_icon') menu_open_icon!: ElementRef<HTMLSpanElement>;
  @ViewChild('menu') menu!: ElementRef<HTMLElement>;

  @HostListener('window:resize')
  onResize() {
    this.screen_w = window.innerWidth;
    if (this.screen_w > 800) {
      this.menu_open.nativeElement.style.left = '-100%';
      this.menu.nativeElement.style.left = '0';
    } else {
      this.menu_open.nativeElement.style.left = '0';
      this.menu.nativeElement.style.left = '-100%';
    }
  }
  constructor(
    private router: Router,
    private auth: AuthService,
    private api_service: Service,
    private router_link: Router,
    private cookies: CookieService,
    private refresh: RefreshService,
    private renderer: Renderer2
  ) {
    Users.api_service =
      Posts.api_service =
      Comments.api_service =
      Likes.api_service =
      Cloudinary.api_service =
        this.api_service;
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

    renderer.listen('window', 'click', (e: Event) => {
      if (
        e.target !== this.menu_open.nativeElement &&
        e.target !== this.menu_open_icon.nativeElement &&
        e.target !== this.menu.nativeElement &&
        this.screen_w <= 800
      )
        this.closeMenu();
    });
  }

  async ngOnInit(): Promise<void> {
    if (Cookies.getMode() == Cookies.MODE_LIGHT) this.setLightMode();
    else if (Cookies.getMode() == Cookies.MODE_DARK) this.setDarkMode();

    const is_auth: boolean = await Users.isActualUserAuth();
    if (is_auth)
      this.auth.user$.subscribe({
        next: async (actual_user) => {
          if (actual_user != undefined) {
            const email: string = actual_user?.email || '';
            const name: string =
              actual_user?.given_name || this.tools.getNameMail(email);

            await Users.post({
              name: name,
              email: email,
              url_name: this.tools.createURLName(await this.convUrlName(name)),
              image: actual_user?.picture || '',
              joined: this.tools.getActualISODate(),
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

  openMenu(): void {
    if (this.screen_w <= 800) {
      this.menu_open.nativeElement.style.left = '-100%';
      this.menu.nativeElement.style.left = '0';
    } else if (this.screen_w > 800) this.openMenu();
  }

  closeMenu(): void {
    if (this.screen_w <= 800) {
      this.menu_open.nativeElement.style.left = '0';
      this.menu.nativeElement.style.left = '-100%';
    } else if (this.screen_w > 800) this.openMenu();
  }

  search(e: Event): void {
    const elem = e.target as HTMLInputElement;
    this.router_link.navigateByUrl('/search?by=' + elem.value);
    elem.value = '';
  }

  async setCookies(): Promise<void> {
    try {
      const email_name: string | undefined = (await Users.getByAuth()).email;
      let id: number | undefined = undefined;
      if (email_name != undefined) id = (await Users.getByEmail(email_name)).id;
      if (isNaN(Cookies.getUserID()) && id != undefined) Cookies.setUserID(id);
    } catch (err) {
      // Catch empty? 🤨
    }
  }

  goProfile(): void {
    if (isNaN(Cookies.getUserID())) this.router.navigateByUrl('/login');
    else this.router.navigateByUrl('/profile');
  }

  login(): void {
    Users.login();
  }

  signup(): void {
    Users.signup();
  }

  logout(): void {
    Users.logout();
    Cookies.deleteUserID();
  }

  getUserIDByCookie(): number | undefined {
    if (isNaN(Cookies.getUserID())) return undefined;
    return Cookies.getUserID();
  }

  setLightMode(): void {
    this.s_color = '#fff';
    this.txt_color = '#222';
    this.txt_s_color = '#fff';
    this.left_of_circle = '0px';
    this.bg_of_light = 'var(--p_color)';
    this.bg_of_dark = 'var(--contrast_dark)';

    this.applyStyles();

    Cookies.setMode(Cookies.MODE_LIGHT);
  }

  setDarkMode(): void {
    this.s_color = '#222';
    this.txt_color = '#fff';
    this.txt_s_color = '#222';
    this.left_of_circle = '95%';
    this.bg_of_light = 'var(--contrast_dark)';
    this.bg_of_dark = 'var(--p_color)';

    this.applyStyles();

    Cookies.setMode(Cookies.MODE_DARK);
  }

  applyStyles(): void {
    const styles = [
      { name: 's_color', value: this.s_color },
      { name: 'txt_color', value: this.txt_color },
      { name: 'txt_s_color', value: this.txt_s_color },
    ];

    styles.forEach((style) => {
      document.documentElement.style.setProperty(
        `--${style.name}`,
        style.value
      );
    });

    document.documentElement.style.backgroundColor = this.s_color;
  }

  async convUrlName(url_name: string): Promise<string> {
    await Users.getBy('url_name', url_name).then((user: User[]) => {
      if (user.length > 0) {
        const last_user_splitted: string[] =
          user[user.length - 1].url_name.split('_');
        if (
          !isNaN(parseInt(last_user_splitted[last_user_splitted.length - 1]))
        ) {
          url_name = '';
          const last_user_number: number = parseInt(
            last_user_splitted[last_user_splitted.length - 1]
          );
          const new_user_number: number = last_user_number + 1;

          for (let i: number = 0; i < last_user_splitted.length - 1; i++)
            if (i < last_user_splitted.length - 2)
              url_name += last_user_splitted[i] + '_';
            else url_name += last_user_splitted[i];

          url_name += `_${new_user_number}`;
        } else {
          url_name = url_name + '_1';
        }
      }
    });
    return url_name;
  }
}
