import { Component, Input } from '@angular/core';
import { Likes } from 'src/app/controller/likes/likes';
import { Cookies } from 'src/app/cookies/cookies';
import { Tools } from 'src/app/tools/tools';

@Component({
  selector: 'app-likes',
  templateUrl: './likes.component.html',
  styleUrls: ['./likes.component.css'],
})
export class LikesComponent {
  tools: Tools = new Tools();

  @Input() dateAdded: string = '21/08/2005';
  @Input() cantLikes: number = 0;
  @Input() idPost: number = 0;

  touchLike: number = 0;

  formatDate(): string {
    const isoDate = this.dateAdded;
    const splittedDate: string[] = this.tools.dateToString(isoDate).split(' ');
    return `posted on ${splittedDate[0]} at ${splittedDate[1]} ${splittedDate[2]}`;
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
      const likeID: undefined | number = (
        await Likes.getOf(this.idPost, Cookies.getUserID())
      )[0]?.id;
      if (likeID == undefined) {
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
      Likes.delete(likeID);
      this.cantLikes--;
    } catch (err) {
      console.log('Something went wrong when quit like.');
    }
  }
}
