import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RefreshService {
  public static readonly COOKIE_UPDATED: string = 'cookie_updated';

  private subject: Subject<RefreshData> = new Subject<RefreshData>();

  setUpdate(msg: string): void {
    this.subject.next({ text: msg });
  }

  getUpdate(): Observable<RefreshData> {
    return this.subject.asObservable();
  }
}

interface RefreshData {
  text: string;
}
