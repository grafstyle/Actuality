import { Service } from '../controller/services/services';
import { Post, Posts } from '../controller/posts/posts';
import { Component } from '@angular/core';
import { User, Users } from '../controller/users/users';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  err: string = '';
  posts: Post[] = [];
  users: User[] = [];

  constructor(private _apiService: Service) {}

  async ngOnInit() {
    try {
      this.posts = await new Posts(this._apiService).get();
      await this.getUserToPosts();
    } catch (e) {
      this.err = 'Something went wrong when get the data.';
    }
  }

  async getUserToPosts() {
    this.posts.forEach(async (post) => {
      this.users.push(await Users.get(post.id_user));
    });
  }
}
