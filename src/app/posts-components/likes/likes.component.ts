import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Likes } from 'src/app/controller/likes/likes';
import { Cookies } from 'src/app/cookies/cookies';

@Component({
  selector: 'app-likes',
  templateUrl: './likes.component.html',
  styleUrls: ['./likes.component.css'],
})
export class LikesComponent {
  @Input() cantLikes: number = 0;
  @Input() idPost: number = 0;
  @Output() disliked: EventEmitter<boolean> = new EventEmitter<boolean>();

  touchLike: number = 0;

  async ngOnInit(): Promise<void> {
    const hasLike: boolean = await this.hasLike();
    if (hasLike) this.touchLike++;
  }

  async hasLike(): Promise<boolean> {
    try {
      const likeID: undefined | number = (
        await Likes.getOf(this.idPost, Cookies.getUserID())
      )[0]?.id;
      if (likeID != undefined) return true;
    } catch (err) {
      console.log('Something went wrong when get like.');
    }
    return false;
  }

  setLike(): void {
    this.touchLike++;

    if (this.touchLike == 1) this.addLike();

    if (this.touchLike == 2) {
      this.touchLike = 0;
      this.quitLike();
    }
  }

  async addLike(): Promise<void> {
    try {
      const hasLike: boolean = await this.hasLike();
      if (hasLike == false) {
        Likes.post({
          id_user: Cookies.getUserID(),
          id_post: this.idPost,
        });
        this.cantLikes++;
      } else this.setLike();
    } catch (err) {
      console.log('Something went wrong when add like.');
    }
  }

  async quitLike(): Promise<void> {
    try {
      const likeID: number =
        (await Likes.getOf(this.idPost, Cookies.getUserID()))[0].id || 0;
      await Likes.delete(likeID);
      this.cantLikes--;
      this.disliked.emit(true);
    } catch (err) {
      console.log('Something went wrong when quit like.');
    }
  }
}
