import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Service {
  server: string = 'http://actuality-backend-env.eba-rz9cqmj5.us-east-1.elasticbeanstalk.com/';

  constructor(private _http: HttpClient) {}

  get(path: string): Observable<unknown> {
    return this._http.get(`${this.server}${path}`);
  }

  post(path: string, data: object): Observable<unknown> {
    return this._http.post(`${this.server}${path}`, data);
  }

  put(path: string, id: number, data: object): Observable<unknown> {
    return this._http.put(`${this.server}${path}/put?id=${id}`, data);
  }

  delete(path: string, id: number): Observable<unknown> {
    return this._http.delete(`${this.server}${path}/delete?id=${id}`);
  }

  deleteFile(url: string): Observable<unknown> {
    return this._http.delete(`${this.server}delete/file?url=${url}`);
  }
}
