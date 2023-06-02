import { Component } from '@angular/core';
import { User, Users } from '../controller/users/users';
import { CPost, Posts } from '../controller/posts/posts';
import { Cookies } from '../cookies/cookies';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

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

  constructor(private router: ActivatedRoute, private location: Location) {}

  async ngOnInit() {
    try {
      const paramByUrl = this.router.snapshot.paramMap.get('profile');
      const intentGetUser: User | undefined = (
        await Users.getBy('url_name', paramByUrl)
      )[0];

      if (paramByUrl == 'profile') {
        this.user = await Users.get(Cookies.getUserID());
        this.location.replaceState(this.user.url_name);
      } else if (intentGetUser != undefined) this.user = intentGetUser;
      else return;

      this.cposts = await Posts.getCPosts(
        await Posts.getBy('id_user', Cookies.getUserID())
      );
    } catch (e) {
      this.err = 'Something went wrong getting the user.';
    }
  }
}
