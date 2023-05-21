import { Comment, Comments } from '../comments/comments';
import { Like, Likes } from '../likes/likes';
import { Service } from '../services/services';
import { User, Users } from '../users/users';

export class Posts {
  private static getPath: string = 'posts/get?';
  private static path: string = 'posts';
  public static apiService: Service;

  public static get(id: number): Promise<Post[]> {
    return new Promise((res, rej) => {
      this.apiService.get(`${this.getPath}id=${id}`).subscribe({
        next: (e: any) => res(e as Post[]),
        error: () => rej([]),
      });
    });
  }

  public static getAll(): Promise<Post[]> {
    return new Promise((res, rej) => {
      this.apiService.get(this.path).subscribe({
        next: (e: any) => res(e as Post[]),
        error: () => rej([]),
      });
    });
  }

  public static getLastID(): Promise<number> {
    return new Promise((res, rej) => {
      this.getAll()
        .then((data) => {
          res(data[data.length - 1].id);
        })
        .catch(() => {
          rej(0);
        });
    });
  }

  public static getBy(key: string, data: any): Promise<Post[]> {
    return new Promise((res, rej) => {
      Posts.apiService.get(`${Posts.getPath}${key}=${data}`).subscribe({
        next: (post: any) => res(post as Post[]),
        error: () => rej([] as Post[]),
      });
    });
  }

  public static getCPosts(posts: Post[]): Promise<CPost[]> {
    return new Promise((res) => {
      const users_of_comments: User[] = [];
      const cposts: CPost[] = [];

      posts.forEach(async (post) => {
        const cpost: CPost = {} as CPost;

        cpost.comments = await Comments.getBy('id_post', post.id);
        cpost.likes = await Likes.getBy('id_post', post.id);
        cpost.user_of_post = await Users.get(post.id_user);

        cpost.comments.forEach(async (comment: Comment) => {
          users_of_comments.push(await Users.get(comment.id_user));
        });

        cpost.post = post;
        cpost.user_of_comments = users_of_comments;

        cposts.push(cpost);
      });
      res(cposts);
    });
  }

  public static getIfContains(inTitle: string): Promise<CPost[]> {
    return new Promise((res, rej) => {
      const allPosts: Post[] = [];
      let finalPost: CPost[] = [];

      Posts.getAll()
        .then((data) => {
          data.forEach((post) => {
            if (post.title.toLowerCase().includes(inTitle.toLowerCase()))
              allPosts.push(post);
          });
        })
        .then(async () => {
          finalPost = await Posts.getCPosts(allPosts);
          res(finalPost);
        })
        .catch(() => rej([]));
    });
  }

  public static post(data: Post): Promise<string> {
    return new Promise((res, rej) => {
      this.apiService.post(this.path, data).subscribe({
        next: () => res('The data has been posted.'),
        error: () => rej('Something went wrong when post the data.'),
      });
    });
  }

  public static put(id: number, data: Post): Promise<string> {
    return new Promise((res, rej) => {
      this.apiService.put(this.path, id, data).subscribe({
        next: () => res('The data has been updated.'),
        error: () => rej('Something went wrong when update the data.'),
      });
    });
  }

  public static delete(id: number): Promise<string> {
    return new Promise((res, rej) => {
      this.apiService.delete(this.path, id).subscribe({
        next: () => res('The data has been deleted.'),
        error: () => rej('Something went wrong when delete the data.'),
      });
    });
  }
}

export interface Post {
  id: number;
  id_user: number;
  title: string;
  images: string[];
  date_added: string;
  date_modified: string;
}

export interface CPost {
  post: Post;
  user_of_post: User;
  likes: Like[];
  comments: Comment[];
  user_of_comments: User[];
}
