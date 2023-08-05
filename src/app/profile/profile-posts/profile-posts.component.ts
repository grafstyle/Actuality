import { Component } from '@angular/core';
import { User } from 'src/app/controller/users/users';
import { EditablePostConfig } from 'src/app/posts-components/editable-posts/editable-posts.component';

@Component({
  selector: 'app-profile-posts',
  templateUrl: './profile-posts.component.html',
  styleUrls: ['./profile-posts.component.css', '../profile.component.css'],
})
export class ProfilePostsComponent {
  config: EditablePostConfig = {} as EditablePostConfig;
  user: User = {} as User;
  can_edit_posts: boolean = false;

  ngOnInit(): void {
    this.config.user = this.user;
  }

  setCanEditPost(e: boolean): void {
    this.can_edit_posts = e;
  }
}
