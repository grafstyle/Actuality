import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { User, Users } from '../controller/users/users';
import { Cookies } from '../cookies/cookies';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Tools } from '../tools/tools';
import { Cloudinary } from '../controller/cloudinary/cloudinary';
import { ProfilePostsComponent } from './profile-posts/profile-posts.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  err: string = '';
  user: User = {} as User;
  userRegistered: User = {} as User;

  userImgUpload: Image = {} as Image;
  portraitImgUpload: Image = {} as Image;

  tools: Tools = new Tools();

  @ViewChild('follow_btn') follow_btn!: ElementRef<HTMLButtonElement>;

  canFollow: boolean = false;
  clickFollow: number = 0;
  followStr: string = 'Follow';
  unfollowStr: string = 'Unfollow';

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

  canEditProfile: boolean = false;
  lastTextName: string = '';
  lastTextUrlName: string = '';
  lastBio: string = '';
  lastUserImg: string = '';
  lastPortraitImg: string = '';
  nameError: string = '';
  urlNameError: string = '';
  bioError: string = '';
  bioLetters: number = 0;
  editProfileStr = 'Edit';
  okStr = 'Ok';
  def_person_img: string =
    'https://res.cloudinary.com/dp5gpr5sc/image/upload/v1685629395/app_assets/person.svg';

  @ViewChild('followe_rs_d_view') frsd_view!: ElementRef<HTMLDivElement>;
  folls: User[] = [];
  follsEmptyStr: string = '';
  modalFollowedOpened: boolean = false;

  showLoadScreen: boolean = false;

  constructor(
    private router: ActivatedRoute,
    private routerActions: Router,
    private cd: ChangeDetectorRef
  ) {
    routerActions.events.subscribe({
      next: (e) => {
        if (e instanceof NavigationEnd) this.ngOnInit();
      },
    });
  }

  async ngOnInit() {
    try {
      const paramByUrl = this.router.snapshot.paramMap.get('profile');
      const intentGetUser: User | undefined = (
        await Users.getBy('url_name', paramByUrl)
      )[0];

      if (paramByUrl == 'profile') {
        this.user = await Users.get(Cookies.getUserID());
        this.routerActions.navigateByUrl('/' + this.user.url_name);
      } else if (intentGetUser != undefined) {
        this.user = intentGetUser;
        if (Cookies.getUserID() == this.user.id) this.canEditProfile = true;
        else {
          this.userRegistered = await Users.get(Cookies.getUserID());
          this.canFollow = true;
          if (this.userFollowsUser()) {
            this.follow_btn.nativeElement.textContent = this.unfollowStr;
            this.clickFollow = 1;
          }
        }
      } else {
        if (this.user.id == undefined && this.userRegistered.id == undefined)
          this.err = "This user doesn't exist.";
        return;
      }
    } catch (e) {
      this.err = 'Something went wrong getting the user.';
    }
  }

  formatDate(): string {
    const date = this.tools
      .dateToString(this.user.joined)
      .split(' ')[0]
      .split('/');
    return `Joined at ${date[0]} of ${this.tools
      .getMonthOfNumber(date[1])
      .toLowerCase()} of ${date[2]}`;
  }

  elemLoaded(component: ProfilePostsComponent) {
    component.user = this.user;
    if (this.user.id == Cookies.getUserID()) component.canEditPost = true;
  }

  async refreshUserOfUrl(): Promise<void> {
    if (this.user.id != undefined) this.user = await Users.get(this.user.id);
  }

  userFollowsUser(): boolean {
    const followers: number[] = this.user.followers;

    if (followers != undefined)
      for (const follower of followers)
        if (follower == this.userRegistered.id) return true;

    return false;
  }

  async unfollowAndRefresh(
    idToUnfollow: number | undefined = undefined
  ): Promise<void> {
    await this.unfollowUser(idToUnfollow).then(() => this.showAllFollowed());
  }

  async unfollowUser(
    idToUnfollow: number | undefined = undefined
  ): Promise<void> {
    const editedFollowers: number[] = [];
    const editedFollowed: number[] = [];

    const editedProfileUser: User = {} as User;
    const editedRegisteredUser: User = {} as User;

    let userWithFd: User = {} as User;

    if (idToUnfollow != undefined) userWithFd = await Users.get(idToUnfollow);
    else userWithFd = this.userRegistered;

    if (this.user.id != undefined && userWithFd.id != undefined) {
      if (idToUnfollow != undefined) {
        for (const followed of this.user.followed) {
          if (followed == userWithFd.id) continue;
          editedFollowed.push(followed);
        }

        for (const followers of userWithFd.followers) {
          if (followers == this.user.id) continue;
          editedFollowers.push(followers);
        }

        editedProfileUser.followed = editedFollowed;
        editedRegisteredUser.followers = editedFollowers;
      } else {
        for (const follower of this.user.followers) {
          if (follower == userWithFd.id) continue;
          editedFollowers.push(follower);
        }

        for (const followed of userWithFd.followed) {
          if (followed == this.user.id) continue;
          editedFollowed.push(followed);
        }

        editedProfileUser.followers = editedFollowers;
        editedRegisteredUser.followed = editedFollowed;
      }

      await Users.put(editedProfileUser, this.user.id).then(async () => {
        await this.refreshUserOfUrl();
        if (this.follow_btn != undefined)
          this.follow_btn.nativeElement.textContent = this.followStr;
      });

      await Users.put(editedRegisteredUser, userWithFd.id);
    }
  }

  async followClick(): Promise<void> {
    this.clickFollow++;

    const editedProfileUser: User = {} as User;
    const editedRegisteredUser: User = {} as User;

    if (this.userRegistered == undefined)
      this.routerActions.navigateByUrl('/signup');

    if (this.clickFollow == 1) {
      if (this.user.id != undefined && this.userRegistered.id != undefined) {
        this.userRegistered = await Users.get(this.userRegistered.id);

        const followers: number[] = [...this.user.followers];
        const followed_of_registered: number[] = [
          ...this.userRegistered.followed,
        ];

        if (this.userRegistered.id != undefined)
          followers.push(this.userRegistered.id);
        followed_of_registered.push(this.user.id);

        editedProfileUser.followers = followers;
        editedRegisteredUser.followed = followed_of_registered;

        await Users.put(editedProfileUser, this.user.id).then(async () => {
          await this.refreshUserOfUrl();
          this.follow_btn.nativeElement.textContent = this.unfollowStr;
        });

        if (this.userRegistered.id != undefined)
          await Users.put(editedRegisteredUser, this.userRegistered.id);
      }
    }

    if (this.clickFollow == 2) {
      await this.unfollowUser();
      this.clickFollow = 0;
    }
  }

  async editProfile(): Promise<boolean> {
    const editedUser: User = {} as User;

    let editedName: string = this.name_text.nativeElement.innerText;
    let editedUrlName: string = this.url_name_text.nativeElement.innerText;
    let editedBio: string = this.bio_text.nativeElement.innerText;

    this.nameError = '';
    this.urlNameError = '';
    this.bioError = '';

    let canEdit: boolean = true;
    let isEditedUrlName: boolean = false;

    if (this.lastTextName != editedName && editedName != '')
      editedUser.name = editedName;
    else this.name_text.nativeElement.innerText = this.lastTextName;

    if (this.lastTextUrlName != editedName && editedName != '')
      editedUser.url_name = editedUrlName;
    else this.url_name_text.nativeElement.innerText = this.lastTextUrlName;

    if (this.lastBio != editedName && editedName != '')
      editedUser.bio = editedBio;
    else this.bio_text.nativeElement.innerText = this.lastBio;

    editedName = this.name_text.nativeElement.innerText;
    editedUrlName = this.url_name_text.nativeElement.innerText;
    editedBio = this.bio_text.nativeElement.innerText;

    if (editedName != this.lastTextName) {
      if (editedName.match(/(?=[^a-z])\S/gi) || editedName.includes('\n')) {
        this.nameError =
          "The name must don't have special caracters or numbers.";
        canEdit = false;
      } else if (editedName.length > 30) {
        this.nameError = 'The name is so long.';
        canEdit = false;
      } else this.nameError = '';
    }

    if (editedUrlName != this.lastTextUrlName) {
      const exist: User = (await Users.getBy('url_name', editedUrlName))[0];

      if (exist != undefined) {
        this.urlNameError = 'The url name exist.';
      } else if (
        editedUrlName.match(/[^a-z0-9_]|\s/gi) ||
        editedUrlName.includes('\n')
      ) {
        this.urlNameError =
          'The url name only accepts digits, underscore and letters.';
        canEdit = false;
      } else if (editedUrlName.length > 30) {
        this.urlNameError = 'The url name is so long.';
        canEdit = false;
      } else {
        isEditedUrlName = true;
        this.urlNameError = '';
      }
    }

    if (editedBio != this.lastBio) {
      if (editedBio.length > 300) {
        this.bioError = 'The bio is so long.';
        canEdit = false;
      } else this.bioError = '';
    }

    if (canEdit == false) return canEdit;

    this.showLoadScreen = true;

    if (
      this.userImgUpload.url != undefined &&
      this.userImgUpload.url != this.lastUserImg
    ) {
      try {
        if (this.lastUserImg.includes('https://res.cloudinary.com'))
          await Cloudinary.delete(this.lastUserImg);

        const imageUploaded = await Cloudinary.post({
          name: this.userImgUpload.name,
          image: await this.tools.getImage(this.userImgUpload.file),
          url: `users/${this.user.id}/image`,
        });

        editedUser.image = await JSON.parse(imageUploaded)['secure_url'];
      } catch (err) {
        // Not empty
      }
    }

    if (
      this.portraitImgUpload.url != undefined &&
      this.portraitImgUpload.url != this.lastPortraitImg
    ) {
      try {
        if (this.lastPortraitImg.includes('https://res.cloudinary.com'))
          await Cloudinary.delete(this.lastPortraitImg);

        const imageUploaded = await Cloudinary.post({
          name: this.portraitImgUpload.name,
          image: await this.tools.getImage(this.portraitImgUpload.file),
          url: `users/${this.user.id}/portrait`,
        });

        editedUser.portrait = await JSON.parse(imageUploaded)['secure_url'];
      } catch (err) {
        // Not empty
      }
    }

    editedUser.name = editedName;
    editedUser.url_name = editedUrlName;
    editedUser.bio = editedBio;

    if (this.user.id != undefined)
      Users.put(editedUser, this.user.id).then(() => {
        this.showLoadScreen = false;
        if (isEditedUrlName)
          this.routerActions.navigateByUrl(editedUser.url_name);
        this.ngOnInit();
      });

    return canEdit;
  }

  setBioLetters(): void {
    this.bioLetters = this.bio_text.nativeElement.innerText.length;
  }

  editUserImg(open: boolean): void {
    if (open) {
      this.edit_user_img.nativeElement.style.display = 'none';
      this.user_img_options.nativeElement.style.display = 'flex';

      if (this.user_img.nativeElement.src.includes('https://'))
        this.lastUserImg = this.user_img.nativeElement.src;
      return;
    }

    this.edit_user_img.nativeElement.style.display = 'block';
    this.user_img_options.nativeElement.style.display = 'none';
  }

  async changeUserImg(e: Event): Promise<void> {
    const input: HTMLInputElement = e.target as HTMLInputElement;

    this.userImgUpload.file = input.files?.item(0) as File;
    this.userImgUpload.name = this.userImgUpload.file.name;
    this.userImgUpload.url = await this.tools.getImage(this.userImgUpload.file);

    this.user_img.nativeElement.src = this.userImgUpload.url;
  }

  quitNewUserImg(): void {
    this.user_img.nativeElement.src = this.lastUserImg;
    this.user_input.nativeElement.value = '';
  }

  editPortraitImg(open: boolean): void {
    if (open) {
      this.edit_portrait_img.nativeElement.style.display = 'none';
      this.portrait_options.nativeElement.style.display = 'flex';

      if (this.portrait_img.nativeElement.src.includes('https://'))
        this.lastPortraitImg = this.portrait_img.nativeElement.src;
      return;
    }

    this.edit_portrait_img.nativeElement.style.display = 'block';
    this.portrait_options.nativeElement.style.display = 'none';
  }

  async changePortrait(e: Event): Promise<void> {
    const input: HTMLInputElement = e.target as HTMLInputElement;

    this.portraitImgUpload.file = input.files?.item(0) as File;
    this.portraitImgUpload.name = this.portraitImgUpload.file.name;
    this.portraitImgUpload.url = await this.tools.getImage(
      this.portraitImgUpload.file
    );

    this.portrait_img.nativeElement.src = this.portraitImgUpload.url;
  }

  quitNewPortrait(): void {
    this.portrait_img.nativeElement.src = this.lastPortraitImg;
    this.portrait_input.nativeElement.value = '';
  }

  async modalEditProfile(open: boolean): Promise<void> {
    if (open) {
      this.setBioLetters();

      this.edit_profile.nativeElement.style.opacity = '1';
      this.edit_profile.nativeElement.style.pointerEvents = 'all';

      this.lastTextName = this.name_text.nativeElement.innerText;
      this.lastTextUrlName = this.url_name_text.nativeElement.innerText;
      this.lastBio = this.bio_text.nativeElement.innerText;

      this.tools.setCursorToLast(this.name_text);
      return;
    }

    if (await this.editProfile()) {
      this.edit_profile.nativeElement.style.opacity = '0';
      this.edit_profile.nativeElement.style.pointerEvents = 'none';
    }
  }

  async showContFoll(show: boolean = true): Promise<void> {
    this.folls = [];

    if (show) {
      this.frsd_view.nativeElement.style.opacity = '1';
      this.frsd_view.nativeElement.style.pointerEvents = 'all';
      return;
    }

    this.modalFollowedOpened = false;
    this.frsd_view.nativeElement.style.opacity = '0';
    this.frsd_view.nativeElement.style.pointerEvents = 'none';
  }

  async showAllFollowers(): Promise<void> {
    this.showContFoll();

    for (const id of this.user.followers) this.folls.push(await Users.get(id));

    if (this.folls.length == 0)
      this.follsEmptyStr = "This user don't has followers.";
  }

  async showAllFollowed(): Promise<void> {
    this.showContFoll();
    this.modalFollowedOpened = true;

    for (const id of this.user.followed) this.folls.push(await Users.get(id));

    if (this.folls.length == 0)
      this.follsEmptyStr = "This user don't follow anyone.";
  }
}

interface Image {
  file: File;
  name: string;
  url: string;
}
