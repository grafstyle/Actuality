import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CPost, Posts } from 'src/app/controller/posts/posts';
import { User, Users } from 'src/app/controller/users/users';
import { RefreshService } from 'src/app/tools/refresh-service/refresh-service';
import { Cookies } from 'src/app/cookies/cookies';
import { Tools } from 'src/app/tools/tools';
import { CarrouselMediaComponent } from 'src/app/posts-components/carrousel-media/carrousel-media.component';

@Component({
  selector: 'app-home-followed',
  templateUrl: './home-followed.component.html',
  styleUrls: ['./home-followed.component.css', '../home.component.css'],
})
export class HomeFollowedComponent implements OnInit {
  tools: Tools = new Tools();

  err: string = '';
  public static readonly ERR_GET_POSTS: string =
    'Something went wrong when get the data.';
  public static readonly ERR_NO_POSTS: string =
    'The people than you follows, no posted nothing.';
  public static readonly ERR_NO_USERS: string =
    "You don't follow people, be more sociable. :)";

  cposts: CPost[] = [];
  def_person_img: string = '../../assets/person.svg';

  show_loader: boolean = true;
  open_media_carrousel: boolean = false;

  actual_media_carrousel = 0;
  carrousel_media!: CarrouselMediaComponent;

  constructor(private refresh: RefreshService, private cd: ChangeDetectorRef) {}

  async ngOnInit(): Promise<void> {
    await this.getCompletePosts();

    this.refresh.getUpdate().subscribe({
      next: async (subject: any) => {
        if (subject.text == RefreshService.REFRESH_POSTS)
          await this.getCompletePosts();
      },
    });
  }

  async getCompletePosts(): Promise<void> {
    try {
      const user: User = (await Users.getBy('id', Cookies.getUserID()))[0];
      const users_followed: number[] = user.followed;
      if (users_followed.length == 0) this.err = this.ERR_NO_USERS;
      for (const id_user_followed of users_followed)
        this.cposts = this.cposts
          .concat(
            await Posts.getCPosts(
              await Posts.getBy('id_user', id_user_followed)
            )
          )
          .reverse();
      if (this.cposts.length == 0 && users_followed.length > 0)
        this.err = this.ERR_NO_POSTS;
    } catch (e) {
      this.err = this.ERR_GET_POSTS;
    }

    this.show_loader = false;
  }

  openMediaCarrousel(pos: number, carrousel: CarrouselMediaComponent): void {
    this.open_media_carrousel = true;
    this.actual_media_carrousel = pos;
    if (carrousel != undefined) carrousel.open();
    this.cd.detectChanges();
  }

  get ERR_NO_USERS(): string {
    return HomeFollowedComponent.ERR_NO_USERS;
  }

  get ERR_NO_POSTS(): string {
    return HomeFollowedComponent.ERR_NO_POSTS;
  }

  get ERR_GET_POSTS(): string {
    return HomeFollowedComponent.ERR_GET_POSTS;
  }
}
