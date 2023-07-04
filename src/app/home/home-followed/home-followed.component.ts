import { Component } from '@angular/core';
import { CPost, Posts } from 'src/app/controller/posts/posts';
import { Users } from 'src/app/controller/users/users';
import { RefreshService } from 'src/app/tools/refresh-service/refresh-service';
import { Cookies } from 'src/app/cookies/cookies';

@Component({
  selector: 'app-home-followed',
  templateUrl: './home-followed.component.html',
  styleUrls: ['./home-followed.component.css', '../home.component.css'],
})
export class HomeFollowedComponent {
  err: string = '';
  errFoll: string = '';
  cposts: CPost[] = [];
  def_person_img: string =
    'https://res.cloudinary.com/dp5gpr5sc/image/upload/v1685629395/app_assets/person.svg';

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
        this.errFoll = "You don't follow people, be more sociable. :)";
      for (const idUserFollowed of usersFollowed)
        this.cposts = this.cposts.concat(
          await Posts.getCPosts(await Posts.getBy('id_user', idUserFollowed))
        );
      if (this.cposts.length == 0)
        this.errFoll = 'The people than you follows, no posted nothing.';
    } catch (e) {
      this.err = 'Something went wrong when get the data.';
    }
  }
}
