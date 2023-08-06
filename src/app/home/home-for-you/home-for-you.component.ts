import { Component, OnInit } from '@angular/core';
import { CPost, Posts } from 'src/app/controller/posts/posts';
import { RefreshService } from 'src/app/tools/refresh-service/refresh-service';
import { Tools } from 'src/app/tools/tools';

@Component({
  selector: 'app-home-for-you',
  templateUrl: './home-for-you.component.html',
  styleUrls: ['./home-for-you.component.css', '../home.component.css'],
})
export class HomeForYouComponent implements OnInit {
  tools: Tools = new Tools();

  err: string = '';
  public static readonly ERR_NO_POSTS = 'The app dont has posts.';
  public static readonly ERR_GET_POSTS =
    'Something went wrong when get the data.';

  cposts: CPost[] = [];
  def_person_img: string =
    'https://res.cloudinary.com/dp5gpr5sc/image/upload/v1685629395/app_assets/person.svg';

  show_loader: boolean = true;

  constructor(private refresh: RefreshService) {}

  async ngOnInit(): Promise<void> {
    await this.getCompletePosts();

    this.refresh.getUpdate().subscribe({
      next: async (subject: any) => {
        if (subject.text == 'refresh_posts') await this.getCompletePosts();
      },
    });
  }

  async getCompletePosts(): Promise<void> {
    try {
      this.cposts = await Posts.getCPosts(await Posts.getAll());
      if (this.cposts.length == 0) this.err = this.ERR_NO_POSTS;
      else this.err = '';
    } catch (e) {
      this.err = this.ERR_GET_POSTS;
    }

    this.show_loader = false;
  }

  get ERR_NO_POSTS(): string {
    return HomeForYouComponent.ERR_NO_POSTS;
  }

  get ERR_GET_POSTS(): string {
    return HomeForYouComponent.ERR_GET_POSTS;
  }
}
