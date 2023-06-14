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
import { User, Users } from 'src/app/controller/users/users';

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.css', '../comments.component.css'],
})
export class AddCommentComponent {
  @Input() idPost: number = 0;

  toComment: Comment = {} as Comment;
  user: User = {} as User;
  tools: Tools = new Tools();
  imgs: Image[] = [];

  def_person_img: string =
    'https://res.cloudinary.com/dp5gpr5sc/image/upload/v1685629395/app_assets/person.svg';

  @ViewChild(AddImagesInputComponent) addImagesInput!: AddImagesInputComponent;
  @ViewChild('comment_body') commentBody!: ElementRef<HTMLDivElement>;

  showLoadScreen: boolean = false;

  constructor(private refresh: RefreshService) {}

  async ngOnInit() {
    this.user = await Users.get(Cookies.getUserID());
  }

  ngAfterViewInit() {
    this.setImgsOfImgsComponent();
  }

  setImgsOfImgsComponent(): void {
    this.imgs = this.addImagesInput.imgs;
  }

  getBodyText(): string {
    return this.commentBody.nativeElement.innerText;
  }

  cleanAll(): void {
    this.commentBody.nativeElement.innerText = '';
    this.commentBody.nativeElement.innerHTML = '';
    this.addImagesInput.imgs = [];
    this.addImagesInput.addbtn.nativeElement.value = '';

    this.setImgsOfImgsComponent();
  }

  async comment(): Promise<void> {
    const idUser: number = Cookies.getUserID();

    if (idUser == 0) {
      alert('Auth first');
      return;
    }

    if (this.getBodyText() == ('' || undefined)) {
      alert('Almost add an title to your post.');
      return;
    }

    this.showLoadScreen = true;

    this.toComment.id_user = idUser;
    this.toComment.id_post = this.idPost;

    const newCommentID: number = (await Comments.getLastID()) + 1;

    this.toComment.comment = this.getBodyText();
    this.toComment.images = [];

    for (const img of this.addImagesInput.imgs) {
      const uploadImage = await Cloudinary.post({
        name: img.name,
        image: await this.tools.getImage(img.file),
        url: `comments/${newCommentID}/`,
      });

      this.toComment.images.push(await JSON.parse(uploadImage)['secure_url']);
    }

    this.toComment.date_added = this.tools.getActualISODate();
    this.toComment.date_modified = this.tools.getActualISODate();

    await Comments.post(this.toComment).then(() => {
      this.refresh.setUpdate('refresh_comments');
      this.cleanAll();
      this.showLoadScreen = false;
    });
  }
}
