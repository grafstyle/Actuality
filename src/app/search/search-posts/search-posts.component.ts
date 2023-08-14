import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CPost, Posts } from 'src/app/controller/posts/posts';
import { Tools } from 'src/app/tools/tools';

@Component({
  selector: 'app-search-posts',
  templateUrl: './search-posts.component.html',
  styleUrls: ['./search-posts.component.css'],
})
export class SearchPostsComponent implements OnInit {
  tools: Tools = new Tools();
  err: string = '';
  cposts: CPost[] = [];
  def_person_img: string = '../../assets/person.svg';

  constructor(private router: ActivatedRoute) {}

  async ngOnInit(): Promise<void> {
    try {
      this.router.queryParams.subscribe({
        next: async (param) => {
          if (param['by'] != undefined)
            this.cposts = (await Posts.getIfContains(param['by'])).reverse();
        },
      });
    } catch (e) {
      this.err = 'Something went wrong when get the posts.';
    }
  }
}
