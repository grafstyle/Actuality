import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CPost, Posts } from 'src/app/controller/posts/posts';
import { Tools } from 'src/app/tools/tools';

@Component({
  selector: 'app-search-posts',
  templateUrl: './search-posts.component.html',
  styleUrls: ['./search-posts.component.css'],
})
export class SearchPostsComponent {
  tools: Tools = new Tools();
  err: string = '';
  cposts: CPost[] = [];

  constructor(private router: ActivatedRoute) {}

  async ngOnInit() {
    try {
      this.router.queryParams.subscribe({
        next: async (param) => {
          if (param['by'] != undefined)
            this.cposts = await Posts.getIfContains(param['by']);
        },
      });
    } catch (e) {
      this.err = 'Something went wrong when get the posts.';
    }
  }
}
