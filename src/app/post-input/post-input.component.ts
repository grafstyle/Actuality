import { Component, ElementRef, ViewChild } from '@angular/core';
import { Post } from '../controller/posts/posts';
import { Cloudinary } from '../controller/cloudinary/cloudinary';

@Component({
  selector: 'app-post-input',
  templateUrl: './post-input.component.html',
  styleUrls: ['./post-input.component.css'],
})
export class PostInputComponent {
  toPost: Post = {} as Post;
  imgs: Image[] = [];

  @ViewChild('post_body') postBody!: ElementRef<HTMLDivElement>;
  @ViewChild('addImgCont') addImgCont!: ElementRef<HTMLDivElement>;

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

  changingImg(e: Event): void {
    const elem: HTMLInputElement = e.target as HTMLInputElement;
    const newImg: Image = {} as Image;
    if (this.imgs.length < 3) {
      newImg.file = elem.files?.item(0) as File;

      const reader: FileReader = new FileReader();
      reader.onload = () => {
        newImg.url = reader.result as string;
      };
      reader.readAsDataURL(newImg.file);

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
  }

  post(): void {
    this.imgs.forEach(async (img) => {
      await Cloudinary.post({
        name: img.name,
        image: await this.getImage(img.file),
        url: 'posts/image/',
      });
    });
    this.toPost.title = this.getBodyText();
  }
}

interface Image {
  url: string;
  name: string;
  file: File;
}
