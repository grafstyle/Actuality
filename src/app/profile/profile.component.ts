import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { User, Users } from '../controller/users/users';
import { Cookies } from '../cookies/cookies';
import {
  ActivatedRoute,
  ChildActivationEnd,
  NavigationEnd,
  Router,
} from '@angular/router';
import { Tools } from '../tools/tools';
import { Cloudinary } from '../controller/cloudinary/cloudinary';
import { ProfilePostsComponent } from './profile-posts/profile-posts.component';
import { RefreshService } from '../tools/refresh-service/refresh-service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  err: string = '';
  user: User = {} as User;
  alert_msg = '';
  user_registered: User = {} as User;

  user_img_upload: Image = {} as Image;
  portrait_img_upload: Image = {} as Image;

  tools: Tools = new Tools();

  @ViewChild('follow_btn') follow_btn!: ElementRef<HTMLButtonElement>;

  can_follow: boolean = false;
  click_follow: number = 0;
  follow_str: string = 'Follow';
  unfollow_str: string = 'Unfollow';

  @ViewChild('edit_profile') edit_profile!: ElementRef<HTMLDivElement>;

  @ViewChild('edit_btn') edit_btn!: ElementRef<HTMLButtonElement>;
  @ViewChild('edit_portrait_img')
  edit_portrait_img!: ElementRef<HTMLButtonElement>;
  @ViewChild('edit_user_img') edit_user_img!: ElementRef<HTMLButtonElement>;

  @ViewChild('portrait_img') portrait_img!: ElementRef<HTMLImageElement>;
  @ViewChild('user_img') user_img!: ElementRef<HTMLImageElement>;

  @ViewChild('portrait_input') portrait_input!: ElementRef<HTMLInputElement>;
  @ViewChild('user_img_input') user_input!: ElementRef<HTMLInputElement>;

  @ViewChild('portrait_options') portrait_options!: ElementRef<HTMLDivElement>;
  @ViewChild('user_img_options') user_img_options!: ElementRef<HTMLDivElement>;

  @ViewChild('name') name_text!: ElementRef<HTMLDivElement>;
  @ViewChild('url_name') url_name_text!: ElementRef<HTMLDivElement>;
  @ViewChild('bio') bio_text!: ElementRef<HTMLDivElement>;

  can_edit_profile: boolean = false;
  last_text_name: string = '';
  last_text_url_name: string = '';
  last_bio: string = '';
  last_user_img: string = '';
  last_portrait_img: string = '';
  name_error: string = '';
  url_name_error: string = '';
  bio_error: string = '';
  bio_letters: number = 0;
  edit_profile_str = 'Edit';
  ok_str = 'Ok';
  def_person_img: string = '../../assets/person.svg';

  @ViewChild('followe_rs_d_view') frsd_view!: ElementRef<HTMLDivElement>;
  folls: User[] = [];
  folls_empty_str: string = '';
  modal_followed_opened: boolean = false;

  show_load_screen: boolean = false;
  show_loader: boolean = true;

  constructor(
    private router: ActivatedRoute,
    private router_actions: Router,
    private cd: ChangeDetectorRef,
    private refresh: RefreshService
  ) {
    router_actions.events.subscribe({
      next: (e) => {
        if (e instanceof NavigationEnd) this.ngOnInit();
      },
    });
  }

  async ngOnInit(): Promise<void> {
    try {
      const param_by_url: string | null =
        this.router.snapshot.paramMap.get('profile');
      const intent_get_user: User | undefined = (
        await Users.getBy('url_name', param_by_url)
      )[0];

      if (param_by_url == 'profile') {
        this.can_follow = false;
        this.user = await Users.get(Cookies.getUserID());
        this.refresh.setUpdate(RefreshService.REFRESH_USER);
        this.router_actions.navigateByUrl('/' + this.user.url_name);
      } else if (intent_get_user != undefined) {
        this.user = intent_get_user;
        if (Cookies.getUserID() == this.user.id) this.can_edit_profile = true;
        else {
          this.user_registered = await Users.get(Cookies.getUserID());
          this.refresh.setUpdate(RefreshService.REFRESH_USER, this.user);
          this.can_follow = true;
          this.can_edit_profile = false;
          if (this.userFollowsUser()) {
            if (this.follow_btn != undefined)
              this.follow_btn.nativeElement.textContent = this.unfollow_str;
            this.click_follow = 1;
          }
        }
      } else {
        if (this.user.id == undefined && this.user_registered.id == undefined)
          this.err = "This user doesn't exist.";
        return;
      }
    } catch (e) {
      console.log(e);

      this.err = 'Something went wrong getting the user.';
    }

    this.show_loader = false;
  }

  /**
   * Method to format the date passed by tag
   * @returns { string }
   */
  formatDate(): string {
    const date: string[] = this.tools
      .dateToString(this.user.joined)
      .split(' ')[0]
      .split('/');
    return `Joined at ${date[0]} of ${this.tools
      .getMonthOfNumber(date[1])
      .toLowerCase()} of ${date[2]}`;
  }

  elemLoaded(component: ProfilePostsComponent): void {
    component.user = this.user;
    if (this.user.id == Cookies.getUserID()) component.can_edit_posts = true;
  }

  async refreshUserOfUrl(): Promise<void> {
    if (this.user.id != undefined) this.user = await Users.get(this.user.id);
  }

  userFollowsUser(): boolean {
    const followers: number[] = this.user.followers;

    if (followers != undefined)
      for (const follower of followers)
        if (
          this.user_registered != undefined &&
          follower == this.user_registered.id
        )
          return true;

    return false;
  }

  async unfollowAndRefresh(
    id_to_unfollow: number | undefined = undefined
  ): Promise<void> {
    await this.unfollowUser(id_to_unfollow).then(() => this.showAllFollowed());
  }

  async unfollowUser(
    id_to_unfollow: number | undefined = undefined
  ): Promise<void> {
    const edited_followers: number[] = [];
    const edited_followed: number[] = [];

    const edited_profile_user: User = {} as User;
    const edited_registered_user: User = {} as User;

    let user_with_fd: User = {} as User;

    if (id_to_unfollow != undefined)
      user_with_fd = await Users.get(id_to_unfollow);
    else user_with_fd = this.user_registered;

    if (this.user.id != undefined && user_with_fd.id != undefined) {
      if (id_to_unfollow != undefined) {
        for (const followed of this.user.followed) {
          if (followed == user_with_fd.id) continue;
          edited_followed.push(followed);
        }

        for (const followers of user_with_fd.followers) {
          if (followers == this.user.id) continue;
          edited_followers.push(followers);
        }

        edited_profile_user.followed = edited_followed;
        edited_registered_user.followers = edited_followers;
      } else {
        for (const follower of this.user.followers) {
          if (follower == user_with_fd.id) continue;
          edited_followers.push(follower);
        }

        for (const followed of user_with_fd.followed) {
          if (followed == this.user.id) continue;
          edited_followed.push(followed);
        }

        edited_profile_user.followers = edited_followers;
        edited_registered_user.followed = edited_followed;
      }

      await Users.put(edited_profile_user, this.user.id).then(async () => {
        await this.refreshUserOfUrl();
        if (this.follow_btn != undefined)
          this.follow_btn.nativeElement.textContent = this.follow_str;
      });

      await Users.put(edited_registered_user, user_with_fd.id);
    }
  }

  async followClick(): Promise<void> {
    this.click_follow++;

    const edited_profile_user: User = {} as User;
    const edited_registered_user: User = {} as User;

    if (this.user_registered == undefined)
      this.router_actions.navigateByUrl('/login');

    if (this.click_follow == 1) {
      if (this.user.id != undefined && this.user_registered.id != undefined) {
        this.user_registered = await Users.get(this.user_registered.id);

        const followers: number[] = [...this.user.followers];
        const followed_of_registered: number[] = [
          ...this.user_registered.followed,
        ];

        if (this.user_registered.id != undefined)
          followers.push(this.user_registered.id);
        followed_of_registered.push(this.user.id);

        edited_profile_user.followers = followers;
        edited_registered_user.followed = followed_of_registered;

        await Users.put(edited_profile_user, this.user.id).then(async () => {
          await this.refreshUserOfUrl();
          this.follow_btn.nativeElement.textContent = this.unfollow_str;
        });

        if (this.user_registered.id != undefined)
          await Users.put(edited_registered_user, this.user_registered.id);
      }
    }

    if (this.click_follow == 2) {
      await this.unfollowUser();
      this.click_follow = 0;
    }
  }

  async editProfile(): Promise<boolean> {
    const edited_user: User = {} as User;

    let edited_name: string = this.name_text.nativeElement.innerText;
    let edited_url_name: string = this.url_name_text.nativeElement.innerText;
    let edited_bio: string = this.bio_text.nativeElement.innerText;

    this.name_error = '';
    this.url_name_error = '';
    this.bio_error = '';

    let can_edit: boolean = true;
    let is_edited_url_name: boolean = false;

    if (this.last_text_name != edited_name && edited_name != '')
      edited_user.name = edited_name;
    else this.name_text.nativeElement.innerText = this.last_text_name;

    if (this.last_text_url_name != edited_url_name && edited_url_name != '')
      edited_user.url_name = edited_url_name;
    else this.url_name_text.nativeElement.innerText = this.last_text_url_name;

    if (this.last_bio != edited_bio && edited_bio != '')
      edited_user.bio = edited_bio;
    else this.bio_text.nativeElement.innerText = this.last_bio;

    edited_name = this.name_text.nativeElement.innerText;
    edited_url_name = this.url_name_text.nativeElement.innerText;
    edited_bio = this.bio_text.nativeElement.innerText;

    if (edited_name != this.last_text_name) {
      if (edited_name.match(/(?=[^a-z])\S/gi) || edited_name.includes('\n')) {
        this.name_error =
          "The name must don't have special caracters or numbers.";
        can_edit = false;
      } else if (edited_name.length > 30) {
        this.name_error = 'The name is so long.';
        can_edit = false;
      } else this.name_error = '';
    }

    if (edited_url_name != this.last_text_url_name) {
      const exist: User = (await Users.getBy('url_name', edited_url_name))[0];

      if (exist != undefined) {
        this.url_name_error = 'The url name exist.';
      } else if (
        edited_url_name.match(/[^a-z0-9_]|\s/gi) ||
        edited_url_name.includes('\n')
      ) {
        this.url_name_error =
          'The url name only accepts digits, underscore and letters.';
        can_edit = false;
      } else if (edited_url_name.length > 30) {
        this.url_name_error = 'The url name is so long.';
        can_edit = false;
      } else {
        is_edited_url_name = true;
        this.url_name_error = '';
      }
    }

    if (edited_bio != this.last_bio) {
      if (edited_bio.length > 300) {
        this.bio_error = 'The bio is so long.';
        can_edit = false;
      } else this.bio_error = '';
    }

    if (can_edit == false) return can_edit;

    this.show_load_screen = true;

    if (
      this.user_img_upload.url != undefined &&
      this.user_img_upload.url != this.last_user_img
    ) {
      try {
        if (this.last_user_img.includes('https://res.cloudinary.com'))
          await Cloudinary.delete(this.last_user_img);

        const image_uploaded = await Cloudinary.post({
          name: this.user_img_upload.name,
          image: await this.tools.getImage(this.user_img_upload.file),
          url: `users/${this.user.id}/image`,
        });

        edited_user.image = await JSON.parse(image_uploaded)['secure_url'];
      } catch (err) {
        // Not empty
      }
    }

    if (
      this.portrait_img_upload.url != undefined &&
      this.portrait_img_upload.url != this.last_portrait_img
    ) {
      try {
        if (this.last_portrait_img.includes('https://res.cloudinary.com'))
          await Cloudinary.delete(this.last_portrait_img);

        const image_uploaded = await Cloudinary.post({
          name: this.portrait_img_upload.name,
          image: await this.tools.getImage(this.portrait_img_upload.file),
          url: `users/${this.user.id}/portrait`,
        });

        edited_user.portrait = await JSON.parse(image_uploaded)['secure_url'];
      } catch (err) {
        // Not empty
      }
    }

    edited_user.name = edited_name;
    edited_user.url_name = edited_url_name;
    edited_user.bio = edited_bio;

    if (this.user.id != undefined)
      Users.put(edited_user, this.user.id).then(() => {
        this.show_load_screen = false;
        if (is_edited_url_name)
          this.router_actions.navigateByUrl(edited_user.url_name);
        this.ngOnInit();
        this.refresh.setUpdate(RefreshService.REFRESH_POSTS);
      });

    return can_edit;
  }

  setBioLetters(): void {
    this.bio_letters = this.bio_text.nativeElement.innerText.length;
  }

  editUserImg(open: boolean): void {
    if (open) {
      this.edit_user_img.nativeElement.style.display = 'none';
      this.user_img_options.nativeElement.style.display = 'flex';

      if (this.user_img.nativeElement.src.includes('https://'))
        this.last_user_img = this.user_img.nativeElement.src;
      return;
    }

    this.edit_user_img.nativeElement.style.display = 'block';
    this.user_img_options.nativeElement.style.display = 'none';
  }

  async changeUserImg(e: Event, ...opts: string[]): Promise<void> {
    const input: HTMLInputElement = e.target as HTMLInputElement;

    const file: File = input.files?.item(0) as File;

    if (!this.tools.acceptSomeFileBy(file, opts)) {
      this.alert_msg = 'This file not is supported.';
      input.value = '';
      return;
    } else this.alert_msg = '';

    this.user_img_upload.file = file;
    this.user_img_upload.name = this.user_img_upload.file.name;
    this.user_img_upload.url = await this.tools.getImage(
      this.user_img_upload.file
    );

    this.user_img.nativeElement.src = this.user_img_upload.url;
  }

  quitNewUserImg(): void {
    this.user_img.nativeElement.src = this.last_user_img;
    this.user_input.nativeElement.value = '';
  }

  editPortraitImg(open: boolean): void {
    if (open) {
      this.edit_portrait_img.nativeElement.style.display = 'none';
      this.portrait_options.nativeElement.style.display = 'flex';

      if (this.portrait_img.nativeElement.src.includes('https://'))
        this.last_portrait_img = this.portrait_img.nativeElement.src;
      return;
    }

    this.edit_portrait_img.nativeElement.style.display = 'block';
    this.portrait_options.nativeElement.style.display = 'none';
  }

  async changePortrait(e: Event, ...opts: string[]): Promise<void> {
    const input: HTMLInputElement = e.target as HTMLInputElement;

    const file: File = input.files?.item(0) as File;

    if (!this.tools.acceptSomeFileBy(file, opts)) {
      this.alert_msg = 'This file not is supported.';
      input.value = '';
      return;
    } else this.alert_msg = '';

    this.portrait_img_upload.file = input.files?.item(0) as File;
    this.portrait_img_upload.name = this.portrait_img_upload.file.name;
    this.portrait_img_upload.url = await this.tools.getImage(
      this.portrait_img_upload.file
    );

    this.portrait_img.nativeElement.src = this.portrait_img_upload.url;
  }

  quitNewPortrait(): void {
    this.portrait_img.nativeElement.src = this.last_portrait_img;
    this.portrait_input.nativeElement.value = '';
  }

  async modalEditProfile(open: boolean): Promise<void> {
    if (open) {
      this.setBioLetters();

      this.tools.showComponent(this.edit_profile.nativeElement);

      this.last_text_name = this.name_text.nativeElement.innerText;
      this.last_text_url_name = this.url_name_text.nativeElement.innerText;
      this.last_bio = this.bio_text.nativeElement.innerText;

      this.tools.setCursorToLast(this.name_text);
      return;
    }

    if (await this.editProfile())
      this.tools.hideComponent(this.edit_profile.nativeElement);
  }

  async showContFoll(show: boolean = true): Promise<void> {
    this.folls = [];

    if (show) {
      this.tools.showComponent(this.frsd_view.nativeElement);
      return;
    }

    this.modal_followed_opened = false;
    this.tools.hideComponent(this.frsd_view.nativeElement);
  }

  async showAllFollowers(): Promise<void> {
    this.showContFoll();

    for (const id of this.user.followers) this.folls.push(await Users.get(id));

    if (this.folls.length == 0)
      this.folls_empty_str = "This user don't has followers.";
  }

  async showAllFollowed(): Promise<void> {
    this.showContFoll();
    this.modal_followed_opened = true;

    for (const id of this.user.followed) this.folls.push(await Users.get(id));

    if (this.folls.length == 0)
      this.folls_empty_str = "This user don't follow anyone.";
  }

  goToUser(url_name: string): void {
    this.showContFoll(false);
    this.router_actions
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router_actions.navigate(['/' + url_name]));
  }
}

interface Image {
  file: File;
  name: string;
  url: string;
}
