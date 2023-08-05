import { Component } from '@angular/core';
import { User } from 'src/app/controller/users/users';
import {
  EditablePostConfig,
  EditablePostsComponent,
} from 'src/app/posts-components/editable-posts/editable-posts.component';

@Component({
  selector: 'app-multimedia-posts',
  templateUrl: './multimedia-posts.component.html',
  styleUrls: ['./multimedia-posts.component.css', '../profile.component.css'],
})
export class MultimediaPostsComponent {
  config: EditablePostConfig = {} as EditablePostConfig;
  user: User = {} as User;
  can_edit_posts: boolean = false;

  ngOnInit(): void {
    this.config.user = this.user;
    this.config.show_of = EditablePostsComponent.USER_MULTIMEDIA_POSTS;
    this.config.msg_if_not_posts = "The user don't have posts with multimedia.";
  }

  setCanEditPost(e: boolean): void {
    this.can_edit_posts = e;
  }
}
