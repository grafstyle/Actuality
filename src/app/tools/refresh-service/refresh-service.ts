import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RefreshService {
  public static readonly COOKIE_UPDATED: string = 'cookie_updated';
  public static readonly REFRESH_COMMENTS: string = 'refresh_comments';
  public static readonly REFRESH_POSTS: string = 'refresh_posts';
  public static readonly REFRESH_USER: string = 'refresh_user';

  private subject: Subject<RefreshData> = new Subject<RefreshData>();

  setUpdate(msg: string, data: any = undefined): void {
    this.subject.next({ text: msg, data: data });
  }

  getUpdate(): Observable<RefreshData> {
    return this.subject.asObservable();
  }
}

interface RefreshData {
  text: string;
  data: any;
}
