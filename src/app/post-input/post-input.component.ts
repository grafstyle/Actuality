import { Component, ElementRef, ViewChild } from '@angular/core';
import { Post, Posts } from '../controller/posts/posts';
import { Cloudinary } from '../controller/cloudinary/cloudinary';
import { Tools } from '../tools/tools';
import { Cookies } from '../cookies/cookies';
import { RefreshService } from '../tools/refresh-service/refresh-service';
import {
  AddImagesInputComponent,
  Image,
} from './add-images-input/add-images-input.component';

@Component({
  selector: 'app-post-input',
  templateUrl: './post-input.component.html',
  styleUrls: ['./post-input.component.css'],
})
export class PostInputComponent {
  toPost: Post = {} as Post;
  tools: Tools = new Tools();
  imgs: Image[] = [];

  @ViewChild(AddImagesInputComponent) addImagesInput!: AddImagesInputComponent;
  @ViewChild('post_body') postBody!: ElementRef<HTMLDivElement>;

  constructor(private refresh: RefreshService) {}

  ngAfterViewInit() {
    this.setImgsOfImgsComponent();
  }

  setImgsOfImgsComponent(): void {
    this.imgs = this.addImagesInput.imgs;
  }

  getBodyText(): string {
    return this.postBody.nativeElement.innerText;
  }

  cleanAll(): void {
    this.postBody.nativeElement.innerText = '';
    this.postBody.nativeElement.innerHTML = '';
    this.addImagesInput.imgs = [];
    this.addImagesInput.addbtn.nativeElement.value = '';

    this.setImgsOfImgsComponent();
  }

  async post(): Promise<void> {
    const idUser: number = Cookies.getUserID();

    if (idUser == 0) {
      alert('Auth first');
      return;
    }

    if (this.getBodyText() == ('' || undefined)) {
      alert('Almost add an title to your post.');
      return;
    }

    this.toPost.id_user = idUser;

    const newPostID: number = (await Posts.getLastID()) + 1;

    this.toPost.title = this.getBodyText();
    this.toPost.images = [];

    for (const img of this.addImagesInput.imgs) {
      const uploadImage = await Cloudinary.post({
        name: img.name,
        image: await this.tools.getImage(img.file),
        url: `posts/${newPostID}/`,
      });

      this.toPost.images.push(await JSON.parse(uploadImage)['secure_url']);
    }

    this.toPost.date_added = this.tools.getActualISODate();
    this.toPost.date_modified = this.tools.getActualISODate();

    this.cleanAll();

    const postResponse: string = await Posts.post(this.toPost);

    alert(postResponse);
    if (postResponse == 'The data has been posted.') {
      this.refresh.setUpdate('refresh_posts');
      this.cleanAll();
    }
  }
}
