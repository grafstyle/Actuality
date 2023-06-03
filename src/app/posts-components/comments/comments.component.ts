import {
  Component,
  ElementRef,
  Input,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { User, Users } from 'src/app/controller/users/users';
import { CPost, Posts } from 'src/app/controller/posts/posts';
import { Comment, Comments } from 'src/app/controller/comments/comments';
import { Cookies } from 'src/app/cookies/cookies';
import { Tools } from 'src/app/tools/tools';
import { AddImagesInputComponent } from 'src/app/post-input/add-images-input/add-images-input.component';
import { Cloudinary } from 'src/app/controller/cloudinary/cloudinary';
import { RefreshService } from 'src/app/tools/refresh-service/refresh-service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css'],
})
export class CommentsComponent {
  private tools: Tools = new Tools();
  def_person_img: string =
    'https://res.cloudinary.com/dp5gpr5sc/image/upload/v1685629395/app_assets/person.svg';

  @Input() idPost: number = 0;
  cpost: CPost = {} as CPost;

  @ViewChildren('comment_body') comment_body!: QueryList<
    ElementRef<HTMLParagraphElement>
  >;
  @ViewChildren('imgs_cont') imgs_cont!: ElementRef<HTMLDivElement>;
  @ViewChildren('edit_comment_btn') edit_btn!: QueryList<
    ElementRef<HTMLButtonElement>
  >;

  @ViewChild(AddImagesInputComponent) imgsToEdit!: AddImagesInputComponent;

  user: User = {} as User;

  okStr: string = 'Ok';
  editStr: string = 'Edit';
  bodyOfComment: string = '';
  showImagesInput: boolean = false;
  clickEdit: number = 0;
  actualElem: number = 0;

  constructor(private refresh: RefreshService) {}

  ngAfterViewInit(): void {
    const commentBody = this.comment_body.toArray()[this.actualElem];

    if (commentBody != undefined)
      this.bodyOfComment = commentBody.nativeElement.textContent as string;
  }

  async ngOnInit(): Promise<void> {
    this.user = await Users.get(Cookies.getUserID());
    this.cpost = (await Posts.getCPosts(await Posts.get(this.idPost)))[0];

    this.refresh.getUpdate().subscribe({
      next: (subject: any) => {
        if (subject.text == 'refresh_comments') this.ngOnInit();
      },
    });
  }

  async updateComment(id: number, actualElem: number): Promise<void> {
    this.clickEdit++;
    this.actualElem = actualElem;
    const commentUpdated: Comment = {} as Comment;
    let somethingEdited: boolean = false;
    const imgsToDB: string[] = [];

    const imgsComponent = this.imgsToEdit; // To avoid errors with "undefined"

    const editBtn = this.edit_btn.toArray()[this.actualElem];
    const commentBody = this.comment_body.toArray()[this.actualElem];

    if (this.clickEdit == 1) {
      editBtn.nativeElement.textContent = this.okStr;
      commentBody.nativeElement.contentEditable = 'true';
      commentBody.nativeElement.focus();
      this.showImagesInput = true;

      this.tools.setCursorToLast(commentBody);
    }

    if (this.clickEdit == 2) {
      this.showImagesInput = false;
      editBtn.nativeElement.textContent = this.editStr;
      commentBody.nativeElement.contentEditable = 'false';

      if (commentBody.nativeElement.textContent == '')
        commentBody.nativeElement.textContent = this.bodyOfComment;
      else {
        this.bodyOfComment = commentBody.nativeElement.textContent as string;
        commentUpdated.comment = this.bodyOfComment;
        somethingEdited = true;
      }

      if (this.imgsToEdit.imgsToDelete.length > 0) {
        for (const url of this.imgsToEdit.imgsToDelete)
          Cloudinary.delete(url).catch(() =>
            alert('Something went wrong at delete some image.')
          );
        somethingEdited = true;
      }

      for (const img of this.imgsToEdit.imgs) {
        if (img.url.includes('https://res.cloudinary.com'))
          imgsToDB.push(img.url);

        try {
          const uploadImage = await Cloudinary.post({
            name: img.name,
            image: await this.tools.getImage(img.file),
            url: `comments/${id}/`,
          });

          imgsToDB.push(await JSON.parse(uploadImage)['secure_url']);

          somethingEdited = true;
        } catch (err) {
          /* Catch not empty, or yes? */
        }
      }

      commentUpdated.images = imgsToDB;

      if (somethingEdited) {
        commentUpdated.date_modified = this.tools.getFormattedActualDate();
        Comments.put(id, commentUpdated).then(() => this.ngOnInit());
      }

      this.clickEdit = 0;
    }
  }

  async deleteComment(id: number): Promise<void> {
    Comments.delete(id).then(() => this.ngOnInit());
  }
}
