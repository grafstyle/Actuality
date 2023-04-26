import { Service } from '../controller/services/services';
import { Post, Posts } from '../controller/posts/posts';
import { Component } from '@angular/core';
import { User, Users } from '../controller/users/users';
import { Comments, Comment } from '../controller/comments/comments';
import { async } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  err: string = '';
  posts: Post[] = [];
  users: User[] = [];
  comments: Comment[] = [];
  usersComments: User[] = [];

  async ngOnInit() {
    try {
      this.posts = await Posts.getAll();
      await this.getAll();
    } catch (e) {
      this.err = 'Something went wrong when get the data.';
    }
  }

  async getAll() {
    const comments = await Comments.getAll();

    this.posts.forEach(async (post) => {
      this.users.push(await Users.get(post.id_user));

      comments.forEach((comment: Comment) => {
        if (post.id == comment.id_post) this.comments.push(comment);
      });
    });

    comments.forEach(async (comment: Comment) => {
      this.usersComments.push(await Users.get(comment.id_user));
    });
  }
}
