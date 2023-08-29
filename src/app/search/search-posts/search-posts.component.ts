import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CPost, Posts } from 'src/app/controller/posts/posts';
import { CarrouselMediaComponent } from 'src/app/posts-components/carrousel-media/carrousel-media.component';
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

  open_media_carrousel: boolean = false;

  actual_media_carrousel = 0;
  carrousel_media!: CarrouselMediaComponent;

  constructor(private router: ActivatedRoute, private cd: ChangeDetectorRef) {}

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

  openMediaCarrousel(pos: number, carrousel: CarrouselMediaComponent): void {
    this.open_media_carrousel = true;
    this.actual_media_carrousel = pos;
    if (carrousel != undefined) carrousel.open();
    this.cd.detectChanges();
  }
}
