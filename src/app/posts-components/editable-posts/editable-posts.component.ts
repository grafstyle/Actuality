import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { User, Users } from 'src/app/controller/users/users';
import { Cloudinary } from 'src/app/controller/cloudinary/cloudinary';
import { CPost, Post, Posts } from 'src/app/controller/posts/posts';
import { AddImagesInputComponent } from 'src/app/post-input/add-images-input/add-images-input.component';
import { RefreshService } from 'src/app/tools/refresh-service/refresh-service';
import { Tools } from 'src/app/tools/tools';
import { Like, Likes } from 'src/app/controller/likes/likes';
import { Cookies } from 'src/app/cookies/cookies';
import { CarrouselMediaComponent } from '../carrousel-media/carrousel-media.component';

export interface EditablePostConfig {
  user: User;
  get_by?: string;
  msg_if_not_posts?: string;
  show_of?: number;
}

@Component({
  selector: 'app-editable-posts',
  templateUrl: './editable-posts.component.html',
  styleUrls: [
    './editable-posts.component.css',
    '../../profile/profile.component.css',
  ],
})
export class EditablePostsComponent implements OnInit {
  public static readonly USER_MULTIMEDIA_POSTS = 0;
  public static readonly USER_LIKED_POSTS = 1;

  no_one_post: string = '';

  @Input() config!: EditablePostConfig;
  @Output() can_edit_posts: EventEmitter<boolean> = new EventEmitter<boolean>();

  tools: Tools = new Tools();

  @ViewChildren('edit_post') edit_post!: QueryList<ElementRef<HTMLDivElement>>;
  @ViewChildren('title_posts') title_posts!: QueryList<
    ElementRef<HTMLDivElement>
  >;
  @ViewChildren('edit_post_imgs_btn') edit_post_imgs_btn!: QueryList<
    ElementRef<HTMLButtonElement>
  >;
  @ViewChildren('opt_post_to_click') opt_post_to_click!: QueryList<
    ElementRef<HTMLDivElement>
  >;
  @ViewChildren('list_opt_post') list_opt_post!: QueryList<
    ElementRef<HTMLUListElement>
  >;
  @ViewChild('edit_image_actions')
  edit_image_actions!: ElementRef<HTMLDivElement>;
  @ViewChild('imgs_input') add_images_input!: AddImagesInputComponent;

  cposts: CPost[] = [];
  user: User = {} as User;

  post_to_edit: Post = {} as Post;
  selected_post: number = 0;

  last_text_post_title: string = '';
  show_imgs_input_post: boolean = false;

  show_load_screen: boolean = false;

  def_person_img: string = '../../assets/person.svg';

  alert_error: string = '';

  show_loader: boolean = true;

  cposts_imgs: string[][] = [];

  open_media_carrousel: boolean = false;

  actual_media_carrousel = 0;
  carrousel_media!: CarrouselMediaComponent;

  constructor(private cd: ChangeDetectorRef, private refresh: RefreshService) {}

  ngOnInit(): void {
    this.user = this.config.user;

    this.refreshPosts();

    this.refresh.getUpdate().subscribe({
      next: async (subject: any) => {
        if (subject.text == RefreshService.REFRESH_POSTS)
          await this.refreshPosts();
        else if (subject.text == RefreshService.REFRESH_USER) {
          if (subject.data != undefined) this.user = subject.data;
          else this.user = await Users.get(Cookies.getUserID());
          this.refreshPosts();
          subject.text = {} as User;
        }
      },
    });
  }

  getUserID(): number {
    if (isNaN(Cookies.getUserID())) return 0;
    return Cookies.getUserID();
  }

  async refreshPosts(): Promise<void> {
    if (this.user != undefined) {
      this.no_one_post = '';
      this.cposts = [];
      this.show_loader = true;

      if (this.config.user != undefined) {
        if (this.config.get_by != undefined)
          this.cposts = await Posts.getCPosts(
            await Posts.getBy(this.config.get_by, this.user.id)
          );
        else
          this.cposts = await Posts.getCPosts(
            await Posts.getBy('id_user', this.user.id)
          );
      } else return;

      if (this.config.show_of != undefined) {
        switch (this.config.show_of) {
          case 0: {
            const posts_to_show: CPost[] = [];

            for (const cpost of this.cposts)
              if (cpost.post.images.length > 0) posts_to_show.push(cpost);
            this.cposts = posts_to_show;
            break;
          }

          case 1: {
            const likeds: Like[] = await Likes.getBy('id_user', this.user.id);
            let posts: Post[] = [];

            for await (const liked of likeds) {
              posts = posts.concat(await Posts.getBy('id', liked.id_post));
            }

            this.cposts = await Posts.getCPosts(posts);
            break;
          }
        }
      }

      if (this.cposts_imgs.length > 0) this.cposts_imgs = [];

      for (const cpost of this.cposts) {
        const arr: string[] = [...cpost.post.images];
        this.cposts_imgs.push(arr);
      }

      if (this.cposts.length == 0) {
        if (this.config.msg_if_not_posts != undefined)
          this.no_one_post = this.config.msg_if_not_posts;
        else this.no_one_post = "This user doesn't have any post.";
      }

      this.cposts = this.cposts.reverse();
      this.cposts_imgs = this.cposts_imgs.map((row) => row).reverse();
    }

    this.show_loader = false;
  }

  async modalEditPost(
    open: boolean,
    elem_pos: number,
    cpost_info: Post = {} as Post
  ): Promise<void> {
    this.changeImgsAgain = true;
    this.selected_post = elem_pos;
    const elem: HTMLDivElement =
      this.edit_post.toArray()[elem_pos].nativeElement;

    this.hideOptions(elem_pos);

    this.editImagesOfPost();
    this.quitNewImgsOfPost(true);

    if (open && cpost_info.id > 0) {
      this.tools.showComponent(elem);

      this.post_to_edit = cpost_info;
      return;
    }

    this.tools.hideComponent(elem);

    await this.editPost(elem_pos);

    this.quitNewImgsOfPost();

    this.show_load_screen = false;

    this.cd.detectChanges();
  }

  async editPost(elem_pos: number): Promise<boolean> {
    const title: HTMLDivElement =
      this.title_posts.toArray()[elem_pos].nativeElement;
    const edited_post: Post = {} as Post;
    const imgs_to_db: string[] = [];
    let something_edited: boolean = false;

    if (title.innerText == this.post_to_edit.title || title.innerText == '')
      title.innerText = this.post_to_edit.title;
    else {
      edited_post.title = title.innerText;
      something_edited = true;
    }

    this.show_load_screen = true;

    if (this.add_images_input != undefined) {
      for (const url of this.add_images_input.imgs_to_delete)
        Cloudinary.delete(url)
          .then(() => (something_edited = true))
          .catch(
            () =>
              (this.alert_error = 'Something went wrong at delete some image.')
          );

      for (const img of this.add_images_input.imgs) {
        if (img.url.includes('https://res.cloudinary.com'))
          imgs_to_db.push(img.url);

        try {
          const upload_image = await Cloudinary.post({
            name: img.name,
            image: await this.tools.getImage(img.file),
            url: `posts/${this.post_to_edit.id}/`,
          });

          imgs_to_db.push(await JSON.parse(upload_image)['secure_url']);

          something_edited = true;
        } catch (err) {
          /* Catch not empty, or yes? */
        }
      }

      if (this.add_images_input.imgs_to_delete.length > 0)
        something_edited = true;
    }

    edited_post.images = imgs_to_db;

    if (something_edited) {
      this.post_to_edit.date_modified = this.tools.getActualISODate();
      await Posts.put(this.post_to_edit.id, edited_post).then(() => {
        this.show_load_screen = false;
        this.refreshPosts();
      });
    }

    return something_edited;
  }

  editImagesOfPost(): void {
    this.show_imgs_input_post = true;
    this.cd.detectChanges(); // To avoid errors in develop mode.

    const edit_imgs_btn: HTMLButtonElement =
      this.edit_post_imgs_btn.toArray()[this.selected_post].nativeElement;
    const elem: HTMLDivElement = this.edit_image_actions.nativeElement;

    this.tools.hideComponent(edit_imgs_btn);

    if (elem.style.opacity == '0') {
      this.tools.showComponent(elem, 'auto');
      elem.style.padding = '5px 5px 0 5px';
    }
  }

  quitNewImgsOfPost(only_hide: boolean = false): void {
    const edit_imgs_btn: HTMLButtonElement =
      this.edit_post_imgs_btn.toArray()[this.selected_post].nativeElement;
    this.tools.showComponent(edit_imgs_btn);

    if (only_hide) {
      const elem: HTMLDivElement = this.edit_image_actions.nativeElement;
      this.tools.hideComponent(elem, true);
      elem.style.padding = '0';
      return;
    }

    this.show_imgs_input_post = false;
    this.cd.detectChanges(); // To avoid errors in develop mode.
  }

  deletePost(id: number): void {
    this.show_load_screen = true;
    Posts.delete(id).then(() => {
      this.show_load_screen = false;
      this.refreshPosts();
    });
  }

  showOptions(pos: number): void {
    const actual_list: HTMLUListElement =
      this.list_opt_post.toArray()[pos].nativeElement;
    const actual_to_click: HTMLDivElement =
      this.opt_post_to_click.toArray()[pos].nativeElement;

    actual_list.style.paddingTop = '10px';
    actual_list.style.paddingBottom = '10px';
    actual_list.style.maxHeight = '80px'; // Change it if a new option is added in list

    this.tools.showComponent(actual_to_click);
  }

  hideOptions(pos: number): void {
    const actual_list: HTMLUListElement =
      this.list_opt_post.toArray()[pos].nativeElement;
    const actual_to_click: HTMLDivElement =
      this.opt_post_to_click.toArray()[pos].nativeElement;

    actual_list.style.paddingTop = '0';
    actual_list.style.paddingBottom = '0';
    actual_list.style.maxHeight = '0';

    this.tools.hideComponent(actual_to_click);
  }

  openMediaCarrousel(pos: number, carrousel: CarrouselMediaComponent): void {
    this.open_media_carrousel = true;
    this.actual_media_carrousel = pos;
    if (carrousel != undefined) carrousel.open();
    this.cd.detectChanges();
  }

  imgsToEdit: string[] = [];
  changeImgsAgain: boolean = true;

  setImgs(imgs: string[], changeImgsAgain: boolean = true): boolean {
    if (this.changeImgsAgain) {
      this.imgsToEdit = imgs;
      this.changeImgsAgain = changeImgsAgain;
    }
    return true;
  }
}
