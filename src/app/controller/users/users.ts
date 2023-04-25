import { AuthService } from '@auth0/auth0-angular';
import { Service } from '../services/services';
import { Tools } from 'src/app/tools/tools';

export class Users {
  public static auth: AuthService;
  public static apiService: Service;
  private static tools: Tools = new Tools();

  public static login(): void {
    this.auth.loginWithRedirect();
  }

  public static async signup(): Promise<void> {
    this.auth
      .loginWithRedirect({
        authorizationParams: { screen_hint: 'signup' },
      })
      .subscribe({
        complete: async () => {
          (await this.getAll()).forEach((user) => {
            this.auth.user$.subscribe({
              next: (registerUser) => {
                if (user.email == registerUser?.email) return;
              },
            });
          });

          this.auth.user$.subscribe({
            next: (registerUser) => {
              this.post({
                name: this.tools.convIfUndefined(registerUser?.given_name),
                email: this.tools.convIfUndefined(registerUser?.email),
                url_name: this.tools.createURLName(
                  this.tools.convIfUndefined(registerUser?.given_name)
                ),
                image: this.tools.convIfUndefined(registerUser?.picture),
                joined: this.tools.convIfUndefined(registerUser?.updated_at),
                bio: '',
                portrait: '',
                followed: [''],
                followers: [''],
              });
            },
          });
        },
      });
  }

  public static isActualUserAuth(): Promise<boolean> {
    return new Promise((res, rej) => {
      Users.auth.isAuthenticated$.subscribe({
        next: (data) => res(data),
        error: () => rej('error'),
      });
    });
  }

  public static getByAuth(): Promise<User> {
    return new Promise((res, rej) => {
      Users.auth.user$.subscribe({
        next: (data) => res(data as User),
        error: () => rej('error'),
      });
    });
  }

  public static getByEmail(email: string): Promise<User> {
    return new Promise((res, rej) => {
      this.getAll().then((data) => {
        data.forEach((user) => {
          if (user.email == email) res(user as User);
          rej("Don't find the user.");
        });
      });
    });
  }

  public static getAll(): Promise<User[]> {
    return new Promise((res, rej) => {
      Users.apiService.get('users').subscribe({
        next: (user) => res(user as User[]),
        error: () => rej('Something went wrong when get the user.'),
      });
    });
  }

  public static get(id: number): Promise<User> {
    return new Promise((res, rej) => {
      Users.apiService.get(`users/${id}`).subscribe({
        next: (user) => res(user as User),
        error: () => rej('Something went wrong when get the user.'),
      });
    });
  }

  public static post(data: User): Promise<string> {
    return new Promise((res, rej) => {
      Users.apiService.post('users', data).subscribe({
        next: () => res('The user has been uplodaded.'),
        error: () => rej('Something went wrong when add the user.'),
      });
    });
  }

  public static put(data: User, id: number): Promise<string> {
    return new Promise((res, rej) => {
      Users.apiService.put('user', id, data).subscribe({
        next: () => res('The user has been uplodaded.'),
        error: () => rej('Something went wrong when add the user.'),
      });
    });
  }

  public static delete(id: number): Promise<string> {
    return new Promise((res, rej) => {
      Users.apiService.delete('user', id).subscribe({
        next: () => res('The user has been uplodaded.'),
        error: () => rej('Something went wrong when add the user.'),
      });
    });
  }
}

export interface User {
  id?: number;
  email: string;
  name: string;
  url_name: string;
  image: string;
  portrait: string;
  bio: string;
  followers: string[];
  followed: string[];
  joined: string;
}
