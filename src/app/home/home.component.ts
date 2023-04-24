import { Service } from '../controller/services/services';
import { Post, Posts } from '../controller/posts/posts';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  err: string = '';
  posts: Post[] = [];

  constructor(private _apiService: Service) {}

  async ngOnInit() {
    try {
      this.posts = await new Posts(this._apiService).get();
    } catch (e) {
      this.err = 'Something went wrong when get the data.';
    }
  }
}
