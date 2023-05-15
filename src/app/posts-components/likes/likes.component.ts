import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-likes',
  templateUrl: './likes.component.html',
  styleUrls: ['./likes.component.css'],
})
export class LikesComponent {
  @Input() dateAdded: string = '21/08/2005';
  @Input() cantLikes: number = 0;
  @Input() idPost: number = 0;

  touchLike: number = 0;

  setLike(): void {
    this.touchLike++;

    if (this.touchLike == 1) this.addLike();

    if (this.touchLike == 2) {
      this.touchLike = 0;
      this.quitLike();
    }
  }

  addLike(): void {
    // Hi i'm not empty and eslint is stupid >:).
  }

  quitLike(): void {
    // Hi i'm not empty and eslint is stupid >:).
  }
}
