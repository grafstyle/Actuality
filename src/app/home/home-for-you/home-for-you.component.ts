import { Component } from '@angular/core';
import { CPost, Posts } from 'src/app/controller/posts/posts';

@Component({
  selector: 'app-home-for-you',
  templateUrl: './home-for-you.component.html',
  styleUrls: ['./home-for-you.component.css'],
})
export class HomeForYouComponent {
  err: string = '';
  cposts: CPost[] = [];

  async ngOnInit() {
    try {
      this.cposts = await Posts.getCPosts(await Posts.getAll());
    } catch (e) {
      this.err = 'Something went wrong when get the data.';
    }
  }
}
