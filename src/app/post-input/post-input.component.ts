import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { Post, Posts } from '../controller/posts/posts';
import { Cloudinary } from '../controller/cloudinary/cloudinary';
import { Tools } from '../tools/tools';
import { Cookies } from '../cookies/cookies';
import { RefreshService } from '../tools/refresh-service/refresh-service';
import {
  AddImagesInputComponent,
  Image,
} from './add-images-input/add-images-input.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-input',
  templateUrl: './post-input.component.html',
  styleUrls: ['./post-input.component.css'],
})
export class PostInputComponent implements AfterViewInit {
  to_post: Post = {} as Post;
  tools: Tools = new Tools();
  imgs: Image[] = [];

  @Input('margin_top') margin_top: string = '';

  @ViewChild(AddImagesInputComponent)
  add_images_input!: AddImagesInputComponent;
  @ViewChild('post_body') post_body!: ElementRef<HTMLDivElement>;

  show_load_screen: boolean = false;
  alert_error: string = '';

  constructor(private refresh: RefreshService, private router: Router) {}

  ngAfterViewInit(): void {
    this.setImgsOfImgsComponent();
  }

  setImgsOfImgsComponent(): void {
    this.imgs = this.add_images_input.imgs;
  }

  getBodyText(): string {
    return this.post_body.nativeElement.innerText;
  }

  cleanAll(): void {
    this.post_body.nativeElement.innerText = '';
    this.post_body.nativeElement.innerHTML = '';
    this.add_images_input.imgs = [];
    this.add_images_input.add_btn.nativeElement.value = '';

    this.setImgsOfImgsComponent();
  }

  async post(): Promise<void> {
    const id_user: number = Cookies.getUserID();

    if (isNaN(id_user)) {
      this.router.navigateByUrl('/login');
      return;
    }

    if (this.getBodyText() == '') {
      this.alert_error = 'Is necessary add a title to your post.';
      return;
    }

    this.show_load_screen = true;

    this.to_post.id_user = id_user;

    const new_post_id: number = (await Posts.getLastID()) + 1;

    this.to_post.title = this.getBodyText();
    this.to_post.images = [];

    for (const img of this.add_images_input.imgs) {
      const upload_image = await Cloudinary.post({
        name: img.name,
        image: await this.tools.getImage(img.file),
        url: `posts/${new_post_id}/`,
      });

      this.to_post.images.push(await JSON.parse(upload_image)['secure_url']);
    }

    this.to_post.date_added = this.tools.getActualISODate();
    this.to_post.date_modified = this.tools.getActualISODate();

    await Posts.post(this.to_post).then(() => {
      this.refresh.setUpdate('refresh_posts');
      this.cleanAll();
      this.show_load_screen = false;
    });
  }
}
