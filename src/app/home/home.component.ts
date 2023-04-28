import { CPost, Posts } from '../controller/posts/posts';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
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
