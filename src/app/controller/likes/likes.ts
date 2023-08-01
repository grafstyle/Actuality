import { Service } from '../services/services';

export class Likes {
  private static get_path: string = 'likes/get?';
  private static path: string = 'likes';
  public static api_service: Service;

  public static get(id: number): Promise<Like[]> {
    return new Promise((res, rej) => {
      Likes.api_service.get(`${Likes.get_path}id=${id}`).subscribe({
        next: (likes: any) => res(likes as Like[]),
        error: () => rej([]),
      });
    });
  }

  public static getAll(): Promise<Like[]> {
    return new Promise((res, rej) => {
      Likes.api_service.get(Likes.path).subscribe({
        next: (likes: any) => res(likes as Like[]),
        error: () => rej([]),
      });
    });
  }

  public static getBy(key: string, data: any): Promise<Like[]> {
    return new Promise((res, rej) => {
      Likes.api_service.get(`${Likes.get_path}${key}=${data}`).subscribe({
        next: (post: any) => res(post as Like[]),
        error: () => rej([] as Like[]),
      });
    });
  }

  public static getOf(id_post: number, id_user: number): Promise<Like[]> {
    return new Promise((res, rej) => {
      Likes.api_service
        .get(`${Likes.get_path}id_post=${id_post}&id_user=${id_user}`)
        .subscribe({
          next: (like: any) => res(like as Like[]),
          error: () => rej([] as Like[]),
        });
    });
  }

  public static post(data: Like): Promise<string> {
    return new Promise((res, rej) => {
      Likes.api_service.post(Likes.path, data).subscribe({
        next: () => res('The data has been posted.'),
        error: () => rej('Something went wrong when post the data.'),
      });
    });
  }

  public static delete(id: number): Promise<string> {
    return new Promise((res, rej) => {
      Likes.api_service.delete(Likes.path, id).subscribe({
        next: () => res('The data has been deleted.'),
        error: () => rej('Something went wrong when delete the data.'),
      });
    });
  }
}

export interface Like {
  id?: number;
  id_post: number;
  id_user: number;
}
