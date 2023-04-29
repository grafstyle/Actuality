import { Service } from '../services/services';

export class Likes {
  private static getPath: string = 'likes/get?';
  private static path: string = 'likes';
  public static apiService: Service;

  public static get(id: number): Promise<Like[]> {
    return new Promise((res, rej) => {
      Likes.apiService.get(`${Likes.path}/${id}`).subscribe({
        next: (e: any) => res(e as Like[]),
        error: () => rej([]),
      });
    });
  }

  public static getAll(): Promise<Like[]> {
    return new Promise((res, rej) => {
      Likes.apiService.get(Likes.path).subscribe({
        next: (e: any) => res(e as Like[]),
        error: () => rej([]),
      });
    });
  }

  public static getBy(key: string, data: any): Promise<Like[]> {
    return new Promise((res, rej) => {
      Likes.apiService.get(`${Likes.getPath}${key}=${data}`).subscribe({
        next: (post: any) => res(post as Like[]),
        error: () => rej([] as Like[]),
      });
    });
  }

  public static post(data: Like): Promise<string> {
    return new Promise((res, rej) => {
      Likes.apiService.post(Likes.path, data).subscribe({
        next: () => res('The data has been posted.'),
        error: () => rej('Something went wrong when post the data.'),
      });
    });
  }

  public static delete(id: number): Promise<string> {
    return new Promise((res, rej) => {
      Likes.apiService.delete(Likes.path, id).subscribe({
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
