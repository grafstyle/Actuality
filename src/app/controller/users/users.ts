import { AuthService } from '@auth0/auth0-angular';
import { Service } from '../services/services';

export class Users {
  public static auth: AuthService;
  public static apiService: Service;

  public static login(): void {
    this.auth.loginWithRedirect();
  }

  public static signup(): void {
    this.auth.loginWithRedirect({
      authorizationParams: {
        screen_hint: 'signup',
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

  public static getByAuth(): Promise<any> {
    return new Promise((res, rej) => {
      Users.auth.user$.subscribe({
        next: (data) => res(data),
        error: () => rej('error'),
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
