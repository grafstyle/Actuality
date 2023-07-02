import {
  ChangeDetectorRef,
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

  @ViewChild('all_comments_cont')
  all_comments_cont!: ElementRef<HTMLDivElement>;
  @ViewChildren('comment_body_all') comment_body_all!: QueryList<
    ElementRef<HTMLParagraphElement>
  >;
  @ViewChildren('imgs_cont_all') imgs_cont_all!: ElementRef<HTMLDivElement>;
  @ViewChildren('edit_comment_btn_all') edit_btn_all!: QueryList<
    ElementRef<HTMLButtonElement>
  >;

  showImagesInputAll: boolean = false;
  actualComments: Comment[] = [];

  showLoadScreen: boolean = false;

  alertError: string = '';

  constructor(private refresh: RefreshService, private cd: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    const commentBody = this.comment_body.toArray()[this.actualElem];

    if (commentBody != undefined)
      this.bodyOfComment = commentBody.nativeElement.textContent as string;
  }

  async ngOnInit(): Promise<void> {
    this.user = await Users.get(Cookies.getUserID());
    this.cpost = (await Posts.getCPosts(await Posts.get(this.idPost)))[0];

    this.actualComments = await Comments.getBy('id_post', this.idPost);

    this.refresh.getUpdate().subscribe({
      next: (subject: any) => {
        if (subject.text == 'refresh_comments') this.ngOnInit();
      },
    });
  }

  seeAllComments(): void {
    this.all_comments_cont.nativeElement.style.opacity = '1';
    this.all_comments_cont.nativeElement.style.pointerEvents = 'all';
  }

  hideAllComments(): void {
    this.all_comments_cont.nativeElement.style.opacity = '0';
    this.all_comments_cont.nativeElement.style.pointerEvents = 'none';
  }

  async updateComment(
    id: number,
    actualElem: number,
    ofAllComments: boolean = false
  ): Promise<void> {
    this.clickEdit++;
    this.actualElem = actualElem;
    const commentUpdated: Comment = {} as Comment;
    let somethingEdited: boolean = false;
    const imgsToDB: string[] = [];

    let editBtn: ElementRef<HTMLButtonElement>;
    let commentBody: ElementRef<HTMLDivElement>;

    if (ofAllComments) {
      editBtn = this.edit_btn_all.toArray()[this.actualElem];
      commentBody = this.comment_body_all.toArray()[this.actualElem];
    } else {
      editBtn = this.edit_btn.toArray()[this.actualElem];
      commentBody = this.comment_body.toArray()[this.actualElem];
    }

    if (this.clickEdit == 1) {
      editBtn.nativeElement.textContent = this.okStr;
      commentBody.nativeElement.contentEditable = 'true';
      commentBody.nativeElement.focus();

      if (ofAllComments) this.showImagesInputAll = true;
      else this.showImagesInput = true;

      this.tools.setCursorToLast(commentBody);
    }

    if (this.clickEdit == 2) {
      editBtn.nativeElement.textContent = this.editStr;
      commentBody.nativeElement.contentEditable = 'false';

      this.showLoadScreen = true;

      if (commentBody.nativeElement.textContent == '')
        commentBody.nativeElement.textContent = this.bodyOfComment;
      else {
        this.bodyOfComment = commentBody.nativeElement.textContent as string;
        commentUpdated.comment = this.bodyOfComment;
        somethingEdited = true;
      }

      if (this.imgsToEdit.imgsToDelete.length > 0) {
        for (const url of this.imgsToEdit.imgsToDelete)
          Cloudinary.delete(url).catch(
            () =>
              (this.alertError =
                'Something went wrong at delete some image in server.')
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
        commentUpdated.date_modified = this.tools.getActualISODate();
        await Comments.put(id, commentUpdated).then(() => {
          this.showLoadScreen = false;
          this.ngOnInit();
        });
      }

      this.clickEdit = 0;
      this.showImagesInput = this.showImagesInputAll = false;
    }

    this.cd.detectChanges(); // To avoid errors in develop mode.
  }

  async deleteComment(id: number): Promise<void> {
    this.showLoadScreen = true;
    await Comments.delete(id).then(() => {
      this.showLoadScreen = false;
      this.ngOnInit();
    });
  }
}
