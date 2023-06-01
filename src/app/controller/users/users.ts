import { AuthService } from '@auth0/auth0-angular';
import { Service } from '../services/services';
import { Tools } from 'src/app/tools/tools';

export class Users {
  private static path: string = 'users';
  private static getPath: string = 'users/get?';
  public static auth: AuthService;
  public static apiService: Service;
  private static tools: Tools = new Tools();

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
      this.getAll().then((data) => {
        data.forEach((user) => {
          if (user.email == email) res(user as User);
          rej("Don't find the user.");
        });
      });
    });
  }

  public static getIfContains(dataToGet: UserOfGetBy): Promise<User[]> {
    return new Promise((res, rej) => {
      const finalUser: User[] = [];
      let otherLap: boolean = true;

      Users.getAll()
        .then((data) => {
          data.forEach((user) => {
            let key: keyof typeof user;
            for (key in user) {
              let keyGet: keyof typeof dataToGet;
              for (keyGet in dataToGet) {
                if (
                  otherLap &&
                  key == keyGet &&
                  (user[key] as string)
                    .toLowerCase()
                    .includes(dataToGet[keyGet]?.toLowerCase() as string)
                ) {
                  otherLap = false;
                  finalUser.push(user);
                }
              }
            }
            otherLap = true;
          });
        })
        .catch(() => rej([]));
      res(finalUser);
    });
  }

  public static getBy(key: string, data: any): Promise<User[]> {
    return new Promise((res, rej) => {
      Users.apiService.get(`${Users.getPath}${key}=${data}`).subscribe({
        next: (user: any) => res(user as User[]),
        error: () => rej([]),
      });
    });
  }

  public static getAll(): Promise<User[]> {
    return new Promise((res, rej) => {
      Users.apiService.get(this.path).subscribe({
        next: (user: any) => res(user as User[]),
        error: () => rej('Something went wrong when get the user.'),
      });
    });
  }

  public static get(id: number): Promise<User> {
    return new Promise((res, rej) => {
      Users.apiService.get(`${Users.getPath}id=${id}`).subscribe({
        next: (user: any) => res(user[0] as User),
        error: () => rej('Something went wrong when get the user.'),
      });
    });
  }

  public static post(data: User): Promise<string> {
    return new Promise((res, rej) => {
      Users.apiService.post(this.path, data).subscribe({
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
