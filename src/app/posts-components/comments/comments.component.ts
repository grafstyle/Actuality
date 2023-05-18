import { Component, Input } from '@angular/core';
import { User } from 'src/app/controller/users/users';
import { Post } from 'src/app/controller/posts/posts';
import { Comment } from 'src/app/controller/comments/comments';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css'],
})
export class CommentsComponent {
  @Input() idPost: number = 0;
  @Input() comments: Comment[] = [];
  @Input() post: Post = {} as Post;
  @Input() userOfComments: User = {} as User;
}
