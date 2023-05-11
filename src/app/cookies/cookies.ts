import { CookieService } from 'ngx-cookie-service';

export class Cookies {
  public static cookies: CookieService;

  public static setUser(userID: number) {
    const nowDate: Date = new Date();
    const expDate: Date = new Date(
      nowDate.getFullYear(),
      nowDate.getMonth(),
      nowDate.getDate() + 7
    );
    this.cookies.set('userID', `${userID}`, { expires: expDate });
  }

  public static getUser(): number {
    return parseInt(this.cookies.get('userID'));
  }
}
