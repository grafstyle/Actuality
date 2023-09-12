import { AuthService } from '@auth0/auth0-angular';
import { Service } from '../services/services';

export class Users {
  private static path: string = 'users';
  private static get_path: string = 'users/get?';
  public static auth: AuthService;
  public static api_service: Service;

  public static login(): void {
    this.auth.loginWithRedirect();
  }

  public static async signup(): Promise<void> {
    this.auth.loginWithRedirect({
      authorizationParams: { screen_hint: 'signup' },
    });
  }

  public static logout(): void {
    this.auth.logout();
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
      this.getBy('email', email).then((data) => {
        if (data.length > 0) res(data[0] as User);
        rej("Don't find the user.");
      });
    });
  }

  public static getIfContains(data_to_get: UserOfGetBy): Promise<User[]> {
    return new Promise((res, rej) => {
      const final_user: User[] = [];
      let other_lap: boolean = true;

      Users.getAll()
        .then((data) => {
          data.forEach((user) => {
            let key: keyof typeof user;
            for (key in user) {
              let keyGet: keyof typeof data_to_get;
              for (keyGet in data_to_get) {
                if (
                  other_lap &&
                  key == keyGet &&
                  (user[key] as string)
                    .toLowerCase()
                    .includes(data_to_get[keyGet]?.toLowerCase() as string)
                ) {
                  other_lap = false;
                  final_user.push(user);
                }
              }
            }
            other_lap = true;
          });
        })
        .catch(() => rej([]));
      res(final_user);
    });
  }

  public static getBy(key: string, data: any): Promise<User[]> {
    return new Promise((res, rej) => {
      Users.api_service.get(`${Users.get_path}${key}=${data}`).subscribe({
        next: (user: any) => res(user as User[]),
        error: () => rej([]),
      });
    });
  }

  public static getAll(): Promise<User[]> {
    return new Promise((res, rej) => {
      Users.api_service.get(this.path).subscribe({
        next: (user: any) => res(user as User[]),
        error: () => rej('Something went wrong when get the user.'),
      });
    });
  }

  public static get(id: number): Promise<User> {
    return new Promise((res, rej) => {
      Users.api_service.get(`${Users.get_path}id=${id}`).subscribe({
        next: (user: any) => res(user[0] as User),
        error: () => rej('Something went wrong when get the user.'),
      });
    });
  }

  public static post(data: User): Promise<string> {
    return new Promise((res, rej) => {
      Users.api_service.post(this.path, data).subscribe({
        next: () => res('The user has been uplodaded.'),
        error: () => rej('Something went wrong when add the user.'),
      });
    });
  }

  public static put(data: User, id: number): Promise<string> {
    return new Promise((res, rej) => {
      Users.api_service.put(this.path, id, data).subscribe({
        next: () => res('The user has been uplodaded.'),
        error: () => rej('Something went wrong when add the user.'),
      });
    });
  }

  public static delete(id: number): Promise<string> {
    return new Promise((res, rej) => {
      Users.api_service.delete(this.path, id).subscribe({
        next: () => res('The user has been uplodaded.'),
        error: () => rej('Something went wrong when add the user.'),
      });
    });
  }
}

interface UserOfGetBy {
  name?: string;
  url_name?: string;
}

export interface User {
  id?: number;
  email: string;
  name: string;
  url_name: string;
  image: string;
  portrait: string;
  bio: string;
  followers: number[];
  followed: number[];
  joined: string;
}
