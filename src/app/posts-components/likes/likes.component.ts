import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Likes } from 'src/app/controller/likes/likes';
import { Cookies } from 'src/app/cookies/cookies';

@Component({
  selector: 'app-likes',
  templateUrl: './likes.component.html',
  styleUrls: ['./likes.component.css'],
})
export class LikesComponent implements OnInit {
  @Input() cant_likes: number = 0;
  @Input() id_post: number = 0;
  @Output() disliked: EventEmitter<boolean> = new EventEmitter<boolean>();

  touch_like: number = 0;

  constructor(private router: Router) {}

  async ngOnInit(): Promise<void> {
    const has_like: boolean = await this.hasLike();
    if (has_like) this.touch_like++;
  }

  async hasLike(): Promise<boolean> {
    try {
      const like_id: undefined | number = (
        await Likes.getOf(this.id_post, Cookies.getUserID())
      )[0]?.id;
      if (like_id != undefined) return true;
    } catch (err) {
      console.log('Something went wrong when get like.');
    }
    return false;
  }

  setLike(): void {
    if (isNaN(Cookies.getUserID())) {
      this.router.navigateByUrl('/login');
      return;
    }

    this.touch_like++;

    if (this.touch_like == 1) this.addLike();

    if (this.touch_like == 2) {
      this.touch_like = 0;
      this.quitLike();
    }
  }

  async addLike(): Promise<void> {
    try {
      const has_like: boolean = await this.hasLike();
      if (has_like == false) {
        Likes.post({
          id_user: Cookies.getUserID(),
          id_post: this.id_post,
        });
        this.cant_likes++;
      } else this.setLike();
    } catch (err) {
      console.log('Something went wrong when add like.');
    }
  }

  async quitLike(): Promise<void> {
    try {
      const like_id: number =
        (await Likes.getOf(this.id_post, Cookies.getUserID()))[0].id || 0;
      await Likes.delete(like_id);
      this.cant_likes--;
      this.disliked.emit(true);
    } catch (err) {
      console.log('Something went wrong when quit like.');
    }
  }
}
