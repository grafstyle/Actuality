import { Component } from '@angular/core';
import { CPost, Posts } from 'src/app/controller/posts/posts';
import { Users } from 'src/app/controller/users/users';
import { RefreshService } from 'src/app/tools/refresh-service/refresh-service';
import { Cookies } from 'src/app/cookies/cookies';

@Component({
  selector: 'app-home-followed',
  templateUrl: './home-followed.component.html',
  styleUrls: ['./home-followed.component.css'],
})
export class HomeFollowedComponent {
  err: string = '';
  noFollows: string = '';
  cposts: CPost[][] = [];

  constructor(private refresh: RefreshService) {}

  async ngOnInit() {
    await this.getCompletePosts();

    this.refresh.getUpdate().subscribe({
      next: async (subject: any) => {
        if (subject.text == 'refresh_posts') await this.getCompletePosts();
      },
    });
  }

  async getCompletePosts(): Promise<void> {
    try {
      const user = (await Users.getBy('id', Cookies.getUserID()))[0];
      const usersFollowed = user.followed;
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
