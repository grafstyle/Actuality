import { AuthService } from '@auth0/auth0-angular';

export class Users {
  public static auth: AuthService;

  public static login(): void {
    this.auth.loginWithRedirect();
  }

  public static isActualUserAuth(): Promise<boolean> {
    return new Promise((res, rej) => {
      Users.auth.isAuthenticated$.subscribe({
        next: (data) => res(data),
        error: () => rej('error'),
      });
    });
  }

  public static getByAuth(): Promise<any> {
    return new Promise((res, rej) => {
      Users.auth.user$.subscribe({
        next: (data) => res(data),
        error: () => rej('error'),
      });
    });
  }
}

export interface User {
  id: number;
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
