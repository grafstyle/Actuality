import {
  Component,
  ElementRef,
  HostListener,
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
export class AppComponent {
  tools: Tools = new Tools();
  s_color: string = '#fff';
  txt_color: string = '#000';
  txt_s_color: string = '#fff';
  left_of_circle: string = '0';
  bgOfLight: string = 'var(--p_color)';
  bgOfDark: string = 'var(--contrast_dark)';
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

  getUserIDByCookie(): number | undefined {
    if (isNaN(Cookies.getUserID())) return undefined;
    return Cookies.getUserID();
  }

  setLightMode(): void {
    this.s_color = '#fff';
    this.txt_color = '#222';
    this.txt_s_color = '#fff';
    this.left_of_circle = '0px';
    this.bgOfLight = 'var(--p_color)';
    this.bgOfDark = 'var(--contrast_dark)';

    this.applyStyles();

    Cookies.setMode(Cookies.MODE_LIGHT);
  }

  setDarkMode(): void {
    this.s_color = '#222';
    this.txt_color = '#fff';
    this.txt_s_color = '#222';
    this.left_of_circle = '95%';
    this.bgOfLight = 'var(--contrast_dark)';
    this.bgOfDark = 'var(--p_color)';

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
        const lastUserSplitted: string[] =
          user[user.length - 1].url_name.split('_');
        if (!isNaN(parseInt(lastUserSplitted[lastUserSplitted.length - 1]))) {
          url_name = '';
          const lastUserNumber: number = parseInt(
            lastUserSplitted[lastUserSplitted.length - 1]
          );
          const newUserNumber: number = lastUserNumber + 1;

          for (let i: number = 0; i < lastUserSplitted.length - 1; i++)
            if (i < lastUserSplitted.length - 2)
              url_name += lastUserSplitted[i] + '_';
            else url_name += lastUserSplitted[i];

          url_name += `_${newUserNumber}`;
        } else {
          url_name = url_name + '_1';
        }
      }
    });
    return url_name;
  }

  constructor(
    private router: Router,
    private auth: AuthService,
    private apiService: Service,
    private routerLink: Router,
    private cookies: CookieService,
    private refresh: RefreshService,
    private renderer: Renderer2
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

    const isAuth: boolean = await Users.isActualUserAuth();
    if (isAuth)
      this.auth.user$.subscribe({
        next: async (actualUser) => {
          if (actualUser != undefined) {
            const email: string = actualUser?.email || '';
            const name: string =
              actualUser?.given_name || this.tools.getNameMail(email);

            await Users.post({
              name: name,
              email: email,
              url_name: this.tools.createURLName(await this.convUrlName(name)),
              image: actualUser?.picture || '',
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
}
