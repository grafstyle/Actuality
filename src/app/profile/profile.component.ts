import { Component } from '@angular/core';
import { User, Users } from '../controller/users/users';
import { Post, Posts } from '../controller/posts/posts';
import { Service } from '../controller/services/services';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  err: string = '';
  user: User = {} as User;
  posts: Post[] = [];

  async ngOnInit() {
    try {
      const userEmail: any = await Users.getByAuth();

      this.user = await Users.getByEmail(userEmail?.email);

      (await Posts.getAll()).forEach((e: Post) => {
        if (e.id == this.user.id) this.posts.push(e);
      });
    } catch (e) {
      this.err = 'Something went wrong getting the user.';
    }
  }
}
