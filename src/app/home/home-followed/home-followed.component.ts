import { Component } from '@angular/core';
import { CPost, Posts } from 'src/app/controller/posts/posts';
import { Users } from 'src/app/controller/users/users';

@Component({
  selector: 'app-home-followed',
  templateUrl: './home-followed.component.html',
  styleUrls: ['./home-followed.component.css'],
})
export class HomeFollowedComponent {
  err: string = '';
  noFollows: string = '';
  cposts: CPost[][] = [];

  async ngOnInit() {
    try {
      const usersFollowed = (
        await Users.getByEmail((await Users.getByAuth())?.email)
      ).followed;
      if (usersFollowed.length == 0)
        this.noFollows = "You don't follow people, be more sociable. :)";
      usersFollowed.forEach(async (idUserFollowed: number) => {
        this.cposts.push(
          await Posts.getCPosts(await Posts.getBy('id_user', idUserFollowed))
        );
      });
    } catch (e) {
      this.err = 'Something went wrong when get the data.';
    }
  }
}
