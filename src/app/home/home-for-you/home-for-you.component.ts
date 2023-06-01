import { Component } from '@angular/core';
import { CPost, Posts } from 'src/app/controller/posts/posts';
import { RefreshService } from 'src/app/tools/refresh-service/refresh-service';

@Component({
  selector: 'app-home-for-you',
  templateUrl: './home-for-you.component.html',
  styleUrls: ['./home-for-you.component.css'],
})
export class HomeForYouComponent {
  err: string = '';
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
      this.cposts = await Posts.getCPosts(await Posts.getAll());
    } catch (e) {
      this.err = 'Something went wrong when get the data.';
    }
  }
}
