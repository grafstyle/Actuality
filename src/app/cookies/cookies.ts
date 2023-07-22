import { CookieService } from 'ngx-cookie-service';
import { RefreshService } from '../tools/refresh-service/refresh-service';

export class Cookies {
  public static cookies: CookieService;
  public static refresh: RefreshService;

  public static readonly MODE_LIGHT: number = 0;
  public static readonly MODE_DARK: number = 1;

  public static setUserID(userID: number) {
    const nowDate: Date = new Date();
    const expDate: Date = new Date(
      nowDate.getFullYear(),
      nowDate.getMonth(),
      nowDate.getDate() + 7
    );
    this.cookies.set('userID', `${userID}`, { expires: expDate });
    this.refresh.setUpdate(RefreshService.COOKIE_UPDATED);
  }

  public static getUserID(): number {
    return parseInt(this.cookies.get('userID'));
  }

  public static deleteUserID(): void {
    this.cookies.delete('userID');
  }

  public static setMode(mode: number): void {
    const nowDate: Date = new Date();
    const expDate: Date = new Date(
      nowDate.getFullYear(),
      nowDate.getMonth(),
      nowDate.getDate() + 7
    );
    this.cookies.set('mode', `${mode}`, { expires: expDate });
  }

  public static getMode(): number {
    return parseInt(this.cookies.get('mode'));
  }

  public static deleteActualMode(): void {
    this.cookies.delete('mode');
  }
}
