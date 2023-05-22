import { Component, Input } from '@angular/core';
import { User, Users } from 'src/app/controller/users/users';
import { CPost, Posts } from 'src/app/controller/posts/posts';
import { Comments } from 'src/app/controller/comments/comments';
import { Cookies } from 'src/app/cookies/cookies';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css'],
})
export class CommentsComponent {
  @Input() idPost: number = 0;
  cpost: CPost = {} as CPost;
  user: User = {} as User;

  async ngOnInit(): Promise<void> {
    this.user = await Users.get(Cookies.getUserID());
    this.cpost = (await Posts.getCPosts(await Posts.get(this.idPost)))[0];
  }

  async deleteComment(id: number): Promise<void> {
    const response = await Comments.delete(id);
    alert(response);
  }
}
