import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Cloudinary } from 'src/app/controller/cloudinary/cloudinary';
import { CPost, Post, Posts } from 'src/app/controller/posts/posts';
import { AddImagesInputComponent } from 'src/app/post-input/add-images-input/add-images-input.component';
import { Tools } from 'src/app/tools/tools';
import { User } from 'src/app/controller/users/users';
import { RefreshService } from 'src/app/tools/refresh-service/refresh-service';

@Component({
  selector: 'app-profile-posts',
  templateUrl: './profile-posts.component.html',
  styleUrls: ['./profile-posts.component.css', '../profile.component.css'],
})
export class ProfilePostsComponent {
  noOnePost: string = '';

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

  postToEdit: Post = {} as Post;
  selectedPost: number = 0;
  canEditPost: boolean = false;

  lastTextPostTitle: string = '';
  showImgsInputPost: boolean = false;

  showLoadScreen: boolean = false;

  def_person_img: string =
    'https://res.cloudinary.com/dp5gpr5sc/image/upload/v1685629395/app_assets/person.svg';

  alertError: string = '';

  constructor(private cd: ChangeDetectorRef, private refresh: RefreshService) {}

  ngOnInit(): void {
    this.refreshPosts();

    this.refresh.getUpdate().subscribe({
      next: async (subject: any) => {
        if (subject.text == 'refresh_posts') await this.refreshPosts();
      },
    });
  }

  async refreshPosts(): Promise<void> {
    if (this.user != undefined) {
      this.cposts = await Posts.getCPosts(
        await Posts.getBy('id_user', this.user.id)
      );

      if (this.cposts.length == 0)
        this.noOnePost = "The user don't have posts.";
    }
  }

  async modalEditPost(
    open: boolean,
    elemPos: number,
    cpostInfo: Post = {} as Post
  ): Promise<void> {
    this.hideOptions(elemPos);
    this.selectedPost = elemPos;
    const elem: HTMLDivElement =
      this.edit_post.toArray()[elemPos].nativeElement;

    if (open && cpostInfo.id > 0) {
      elem.style.opacity = '1';
      elem.style.pointerEvents = 'all';

      this.postToEdit = cpostInfo;
      return;
    }

    await this.editPost(elemPos);

    elem.style.opacity = '0';
    elem.style.pointerEvents = 'none';
    this.quitNewImgsOfPost();
  }

  async editPost(elemPos: number): Promise<boolean> {
    const title = this.title_posts.toArray()[elemPos].nativeElement;
    const editedPost: Post = {} as Post;
    const imgsToDB: string[] = [];
    let somethingEdited: boolean = false;

    if (title.innerText == this.postToEdit.title || title.innerText == '')
      title.innerText = this.postToEdit.title;
    else {
      editedPost.title = title.innerText;
      somethingEdited = true;
    }

    this.showLoadScreen = true;

    if (this.add_images_input != undefined) {
      for (const url of this.add_images_input.imgsToDelete)
        Cloudinary.delete(url)
          .then(() => (somethingEdited = true))
          .catch(
            () =>
              (this.alertError = 'Something went wrong at delete some image.')
          );

      for (const img of this.add_images_input.imgs) {
        if (img.url.includes('https://res.cloudinary.com'))
          imgsToDB.push(img.url);

        try {
          const uploadImage = await Cloudinary.post({
            name: img.name,
            image: await this.tools.getImage(img.file),
            url: `posts/${this.postToEdit.id}/`,
          });

          imgsToDB.push(await JSON.parse(uploadImage)['secure_url']);

          somethingEdited = true;
        } catch (err) {
          /* Catch not empty, or yes? */
        }
      }

      if (this.add_images_input.imgsToDelete.length > 0) somethingEdited = true;
    }

    editedPost.images = imgsToDB;

    if (somethingEdited) {
      this.postToEdit.date_modified = this.tools.getActualISODate();
      await Posts.put(this.postToEdit.id, editedPost).then(() => {
        this.showLoadScreen = false;
        this.refreshPosts();
      });
    }

    return somethingEdited;
  }

  editImagesOfPost(): void {
    this.showImgsInputPost = true;
    this.cd.detectChanges(); // To avoid errors in develop mode.

    const editImgsBtn: HTMLButtonElement =
      this.edit_post_imgs_btn.toArray()[this.selectedPost].nativeElement;
    const elem: HTMLDivElement = this.edit_image_actions.nativeElement;

    editImgsBtn.style.opacity = '0';
    editImgsBtn.style.pointerEvents = 'none';

    if (elem.style.opacity == '0') {
      elem.style.opacity = '1';
      elem.style.padding = '5px 5px 0 5px';
      elem.style.pointerEvents = 'all';
      elem.style.height = 'auto';
    }
  }

  quitNewImgsOfPost(onlyHide: boolean = false): void {
    const editImgsBtn: HTMLButtonElement =
      this.edit_post_imgs_btn.toArray()[this.selectedPost].nativeElement;
    editImgsBtn.style.opacity = '1';
    editImgsBtn.style.pointerEvents = 'all';

    if (onlyHide) {
      const elem: HTMLDivElement = this.edit_image_actions.nativeElement;
      elem.style.opacity = '0';
      elem.style.padding = '0';
      elem.style.pointerEvents = 'none';
      elem.style.height = '0';
      return;
    }

    this.showImgsInputPost = false;
    this.cd.detectChanges(); // To avoid errors in develop mode.
  }

  deletePost(id: number): void {
    this.showLoadScreen = true;
    Posts.delete(id).then(() => {
      this.showLoadScreen = false;
      this.refreshPosts();
    });
  }

  showOptions(pos: number): void {
    const actualList: HTMLUListElement =
      this.list_opt_post.toArray()[pos].nativeElement;
    const actualToClick: HTMLDivElement =
      this.opt_post_to_click.toArray()[pos].nativeElement;

    actualList.style.paddingTop = '10px';
    actualList.style.paddingBottom = '10px';
    actualList.style.maxHeight = '80px'; // Change it if a new option is added in list

    actualToClick.style.opacity = '1';
    actualToClick.style.pointerEvents = 'all';
  }

  hideOptions(pos: number): void {
    const actualList: HTMLUListElement =
      this.list_opt_post.toArray()[pos].nativeElement;
    const actualToClick: HTMLDivElement =
      this.opt_post_to_click.toArray()[pos].nativeElement;

    actualList.style.paddingTop = '0';
    actualList.style.paddingBottom = '0';
    actualList.style.maxHeight = '0';

    actualToClick.style.opacity = '0';
    actualToClick.style.pointerEvents = 'none';
  }
}
