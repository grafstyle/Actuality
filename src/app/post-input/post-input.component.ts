import { Component, ElementRef, ViewChild } from '@angular/core';
import { Post } from '../controller/posts/posts';

@Component({
  selector: 'app-post-input',
  templateUrl: './post-input.component.html',
  styleUrls: ['./post-input.component.css'],
})
export class PostInputComponent {
  toPost: Post = {} as Post;
  imgs: string[] = [];

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

  post(): void {
    this.toPost.title = this.getBodyText();
    this.toPost.images = this.imgs;
    alert();
  }
}
