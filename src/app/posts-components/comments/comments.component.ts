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
  tools: Tools = new Tools();
  def_person_img: string =
    'https://res.cloudinary.com/dp5gpr5sc/image/upload/v1685629395/app_assets/person.svg';

  @Input() id_post: number = 0;
  cpost: CPost = {} as CPost;

  @ViewChildren('comment_body') comment_body!: QueryList<
    ElementRef<HTMLParagraphElement>
  >;
  @ViewChildren('imgs_cont') imgs_cont!: ElementRef<HTMLDivElement>;
  @ViewChildren('edit_comment_btn') edit_btn!: QueryList<
    ElementRef<HTMLButtonElement>
  >;

  @ViewChild(AddImagesInputComponent) imgs_to_edit!: AddImagesInputComponent;

  user: User = {} as User;

  ok_str: string = 'Done';
  edit_str: string = 'Edit';
  body_of_comment: string = '';
  show_images_input: boolean = false;
  click_edit: number = 0;
  actual_elem: number = 0;

  @ViewChild('all_comments_cont')
  all_comments_cont!: ElementRef<HTMLDivElement>;
  @ViewChildren('comment_body_all') comment_body_all!: QueryList<
    ElementRef<HTMLParagraphElement>
  >;
  @ViewChildren('imgs_cont_all') imgs_cont_all!: ElementRef<HTMLDivElement>;
  @ViewChildren('edit_comment_btn_all') edit_btn_all!: QueryList<
    ElementRef<HTMLButtonElement>
  >;

  show_images_input_all: boolean = false;
  actual_comments: Comment[] = [];

  show_load_screen: boolean = false;

  alert_error: string = '';

  constructor(private refresh: RefreshService, private cd: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    const comment_body: ElementRef<HTMLParagraphElement> =
      this.comment_body.toArray()[this.actual_elem];

    if (comment_body != undefined)
      this.body_of_comment = comment_body.nativeElement.textContent as string;
  }

  async ngOnInit(): Promise<void> {
    const actual_user: User = await Users.get(Cookies.getUserID());

    if (actual_user != undefined) this.user = actual_user;

    this.cpost = (await Posts.getCPosts(await Posts.get(this.id_post)))[0];
    this.actual_comments = await Comments.getBy('id_post', this.id_post);

    this.refresh.getUpdate().subscribe({
      next: (subject: any) => {
        if (subject.text == 'refresh_comments') this.ngOnInit();
      },
    });
  }

  seeAllComments(): void {
    this.tools.showComponent(this.all_comments_cont.nativeElement);
  }

  hideAllComments(): void {
    this.tools.hideComponent(this.all_comments_cont.nativeElement);
  }

  async updateComment(
    id: number,
    actual_elem: number,
    of_all_comments: boolean = false
  ): Promise<void> {
    this.click_edit++;
    this.actual_elem = actual_elem;
    const comment_updated: Comment = {} as Comment;
    let something_edited: boolean = false;
    const imgs_to_db: string[] = [];

    let edit_btn: ElementRef<HTMLButtonElement>;
    let comment_body: ElementRef<HTMLDivElement>;

    if (of_all_comments) {
      edit_btn = this.edit_btn_all.toArray()[this.actual_elem];
      comment_body = this.comment_body_all.toArray()[this.actual_elem];
    } else {
      edit_btn = this.edit_btn.toArray()[this.actual_elem];
      comment_body = this.comment_body.toArray()[this.actual_elem];
    }

    if (this.click_edit == 1) {
      edit_btn.nativeElement.children[0].textContent = this.ok_str;
      comment_body.nativeElement.contentEditable = 'true';
      comment_body.nativeElement.focus();

      if (of_all_comments) this.show_images_input_all = true;
      else this.show_images_input = true;

      this.tools.setCursorToLast(comment_body);
    }

    if (this.click_edit == 2) {
      edit_btn.nativeElement.children[0].textContent = this.edit_str;
      comment_body.nativeElement.contentEditable = 'false';

      this.show_load_screen = true;

      if (comment_body.nativeElement.textContent == '')
        comment_body.nativeElement.textContent = this.body_of_comment;
      else {
        this.body_of_comment = comment_body.nativeElement.textContent as string;
        comment_updated.comment = this.body_of_comment;
        something_edited = true;
      }

      if (this.imgs_to_edit.imgs_to_delete.length > 0) {
        for (const url of this.imgs_to_edit.imgs_to_delete)
          Cloudinary.delete(url).catch(
            () =>
              (this.alert_error =
                'Something went wrong at delete some image in server.')
          );
        something_edited = true;
      }

      for (const img of this.imgs_to_edit.imgs) {
        if (img.url.includes('https://res.cloudinary.com'))
          imgs_to_db.push(img.url);

        try {
          const upload_image = await Cloudinary.post({
            name: img.name,
            image: await this.tools.getImage(img.file),
            url: `comments/${id}/`,
          });

          imgs_to_db.push(await JSON.parse(upload_image)['secure_url']);

          something_edited = true;
        } catch (err) {
          /* Catch not empty, or yes? */
        }
      }

      comment_updated.images = imgs_to_db;

      if (something_edited) {
        comment_updated.date_modified = this.tools.getActualISODate();
        await Comments.put(id, comment_updated).then(() => {
          this.show_load_screen = false;
          this.ngOnInit();
        });
      }

      this.click_edit = 0;
      this.show_images_input = this.show_images_input_all = false;
    }

    this.cd.detectChanges(); // To avoid errors in develop mode.
  }

  async deleteComment(id: number): Promise<void> {
    this.show_load_screen = true;
    await Comments.delete(id).then(() => {
      this.show_load_screen = false;
      this.ngOnInit();
    });
  }
}
