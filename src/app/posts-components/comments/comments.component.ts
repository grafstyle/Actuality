import { Component, Input } from '@angular/core';
import { User, Users } from 'src/app/controller/users/users';
import { Post } from 'src/app/controller/posts/posts';
import { Comment, Comments } from 'src/app/controller/comments/comments';
import { Cookies } from 'src/app/cookies/cookies';

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

  user: User = {} as User;

  async ngOnInit(): Promise<void> {
    this.user = await Users.get(Cookies.getUserID());
  }

  async deleteComment(id: number): Promise<void> {
    const response = await Comments.delete(id);
    alert(response);
  }
}
