import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Service {
  schema: unknown = this.getSchema();

  constructor(private _http: HttpClient) {}

  getSchema() {
    return this._http.get('http://localhost:3500/PostsSchema');
  }
}
