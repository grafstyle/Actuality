import { Component } from '@angular/core';
import { User, Users } from '../controller/users/users';
import { CPost, Posts } from '../controller/posts/posts';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  err: string = '';
  user: User = {} as User;
  cposts: CPost[] = [];

  async ngOnInit() {
    try {
      const userEmail: any = await Users.getByAuth();

      this.user = await Users.getByEmail(userEmail?.email);
      this.cposts = await Posts.getCPosts(
        await Posts.getBy('id_user', this.user.id)
      );
    } catch (e) {
      this.err = 'Something went wrong getting the user.';
    }
  }
}
