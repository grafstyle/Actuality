import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/controller/users/users';
import {
  EditablePostConfig,
  EditablePostsComponent,
} from 'src/app/posts-components/editable-posts/editable-posts.component';

@Component({
  selector: 'app-liked-posts',
  templateUrl: './liked-posts.component.html',
  styleUrls: ['./liked-posts.component.css', '../profile.component.css'],
})
export class LikedPostsComponent implements OnInit {
  config: EditablePostConfig = {} as EditablePostConfig;
  user: User = {} as User;
  can_edit_posts: boolean = false;

  ngOnInit(): void {
    this.config.user = this.user;
    this.config.show_of = EditablePostsComponent.USER_LIKED_POSTS;
    this.config.msg_if_not_posts = 'This user hates everything and everyone.';
  }

  setCanEditPost(e: boolean): void {
    this.can_edit_posts = e;
  }
}
