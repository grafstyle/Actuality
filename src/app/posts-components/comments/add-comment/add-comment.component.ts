import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import {
  Image,
  AddImagesInputComponent,
} from 'src/app/post-input/add-images-input/add-images-input.component';
import { Comment, Comments } from 'src/app/controller/comments/comments';
import { Tools } from 'src/app/tools/tools';
import { RefreshService } from 'src/app/tools/refresh-service/refresh-service';
import { Cookies } from 'src/app/cookies/cookies';
import { Cloudinary } from 'src/app/controller/cloudinary/cloudinary';
import { User } from 'src/app/controller/users/users';

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.css', '../comments.component.css'],
})
export class AddCommentComponent {
  @Input() id_post: number = 0;

  to_comment: Comment = {} as Comment;
  user: User = {} as User;
  tools: Tools = new Tools();
  imgs: Image[] = [];

  @ViewChild(AddImagesInputComponent)
  add_images_input!: AddImagesInputComponent;
  @ViewChild('comment_body') comment_body!: ElementRef<HTMLDivElement>;

  show_load_screen: boolean = false;

  alert_error: string = '';

  constructor(private refresh: RefreshService) {}

  ngAfterViewInit(): void {
    this.setImgsOfImgsComponent();
  }

  setImgsOfImgsComponent(): void {
    this.imgs = this.add_images_input.imgs;
  }

  getBodyText(): string {
    return this.comment_body.nativeElement.innerText;
  }

  cleanAll(): void {
    this.comment_body.nativeElement.innerText = '';
    this.comment_body.nativeElement.innerHTML = '';
    this.add_images_input.imgs = [];
    this.add_images_input.add_btn.nativeElement.value = '';

    this.setImgsOfImgsComponent();
  }

  async comment(): Promise<void> {
    const id_user: number = Cookies.getUserID();

    if (id_user == 0) {
      this.alert_error = 'Auth first';
      return;
    }

    if (/^\s*$/.test(this.getBodyText())) {
      this.alert_error = 'Please use words or keep silence.';
      return;
    }

    this.show_load_screen = true;

    this.to_comment.id_user = id_user;
    this.to_comment.id_post = this.id_post;

    const new_comment_id: number = (await Comments.getLastID()) + 1;

    this.to_comment.comment = this.getBodyText();
    this.to_comment.images = [];

    for (const img of this.add_images_input.imgs) {
      const upload_image = await Cloudinary.post({
        name: img.name,
        image: await this.tools.getImage(img.file),
        url: `comments/${new_comment_id}/`,
      });

      this.to_comment.images.push(await JSON.parse(upload_image)['secure_url']);
    }

    this.to_comment.date_added = this.tools.getActualISODate();
    this.to_comment.date_modified = this.tools.getActualISODate();

    await Comments.post(this.to_comment).then(() => {
      this.refresh.setUpdate(RefreshService.REFRESH_COMMENTS);
      this.cleanAll();
      this.show_load_screen = false;
    });
  }
}
