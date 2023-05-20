import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Service {
  server: string = 'http://localhost:3500/';

  constructor(private _http: HttpClient) {}

  get(path: string) {
    return this._http.get(`${this.server}${path}`);
  }

  post(path: string, data: object) {
    return this._http.post(`${this.server}${path}`, data);
  }

  put(path: string, id: number, data: object) {
    return this._http.put(`${this.server}${path}/put?id=${id}`, data);
  }

  delete(path: string, id: number) {
    return this._http.delete(`${this.server}${path}/delete?id=${id}`);
  }
}
