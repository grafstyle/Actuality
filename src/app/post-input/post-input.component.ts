import { Component, ElementRef, ViewChild } from '@angular/core';
import { Post, Posts } from '../controller/posts/posts';
import { Cloudinary } from '../controller/cloudinary/cloudinary';
import { Tools } from '../tools/tools';
import { Users } from '../controller/users/users';

@Component({
  selector: 'app-post-input',
  templateUrl: './post-input.component.html',
  styleUrls: ['./post-input.component.css'],
})
export class PostInputComponent {
  toPost: Post = {} as Post;
  tools: Tools = new Tools();
  imgs: Image[] = [];

  @ViewChild('post_body') postBody!: ElementRef<HTMLDivElement>;
  @ViewChild('addImgCont') addImgCont!: ElementRef<HTMLDivElement>;
  @ViewChild('addBtn') addbtn!: ElementRef<HTMLInputElement>;

  getBodyText(): string {
    return this.postBody.nativeElement.innerText;
  }

  chooseImg(show: boolean): void {
    if (show) {
      this.addImgCont.nativeElement.style.opacity = '1';
      this.addImgCont.nativeElement.style.pointerEvents = 'all';
      return;
    }

    this.addImgCont.nativeElement.style.opacity = '0';
    this.addImgCont.nativeElement.style.pointerEvents = 'none';
  }

  async changingImg(e: Event): Promise<void> {
    const elem: HTMLInputElement = e.target as HTMLInputElement;
    const newImg: Image = {} as Image;
    if (this.imgs.length < 3) {
      newImg.file = elem.files?.item(0) as File;
      newImg.url = await this.getImage(newImg.file);
      newImg.name = newImg.file.name;

      this.imgs.push(newImg);
      return;
    }
    alert('Sorry only accept three images and/or videos. :(');
  }

  getImage(file: File): Promise<string> {
    return new Promise((res, rej) => {
      const reader: FileReader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => res(reader.result as string);
      reader.onerror = (err) => rej(err);
    });
  }

  removeLastImage(): void {
    this.imgs.pop();
    if (this.imgs.length == 0) this.addbtn.nativeElement.value = '';
  }

  cleanAll(): void {
    this.postBody.nativeElement.innerText = '';
    this.postBody.nativeElement.innerHTML = '';
    this.imgs = [];
    this.addbtn.nativeElement.value = '';
  }

  async post(): Promise<void> {
    const user = await Users.getByAuth();
    const idUser: number = (await Users.getByEmail(user?.email)).id || 0;

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

    for (const img of this.imgs) {
      const uploadImage = await Cloudinary.post({
        name: img.name,
        image: await this.getImage(img.file),
        url: `posts/${newPostID}/image/`,
      });

      this.toPost.images.push(await JSON.parse(uploadImage)['secure_url']);
    }

    this.toPost.date_added = this.tools.getFormattedActualDate();
    this.toPost.date_modified = this.tools.getFormattedActualDate();

    this.cleanAll();

    const postResponse: string = await Posts.post(this.toPost);

    alert(postResponse);
    if (postResponse == 'The data has been posted.') this.cleanAll();
  }
}

interface Image {
  url: string;
  name: string;
  file: File;
}
