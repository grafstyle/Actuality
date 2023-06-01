import { Component } from '@angular/core';
import { User, Users } from '../controller/users/users';
import { CPost, Posts } from '../controller/posts/posts';
import { Cookies } from '../cookies/cookies';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  err: string = '';
  user: User = {} as User;
  cposts: CPost[] = [];

  def_person_img: string =
    'https://res.cloudinary.com/dp5gpr5sc/image/upload/v1685629395/app_assets/person.svg';

  async ngOnInit() {
    try {
      this.user = (await Users.getBy('id', Cookies.getUserID()))[0];
      this.cposts = await Posts.getCPosts(
        await Posts.getBy('id_user', Cookies.getUserID())
      );
    } catch (e) {
      this.err = 'Something went wrong getting the user.';
    }
  }
}
